import { Injectable } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { toast } from 'ngx-sonner';
import { Order } from '../../features/order/models/order.model';

@Injectable({
    providedIn: 'root'
})
export class InvoiceExportService {

    constructor() { }

    exportInvoice(order: Order, customer: any, products: any[]) {
        try {
            fetch('/assets/templates/invoice-template.docx')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Không tìm thấy file template mẫu invoice-template.docx trong assets/templates/');
                    }
                    return res.arrayBuffer();
                })
                .then(buffer => {
                    const zip = new PizZip(buffer);
                    const doc = new Docxtemplater(zip, {
                        paragraphLoop: true,
                        linebreaks: true
                    });

                    // Format data để truyền vào template
                    const invoiceData = this.formatOrderDataForTemplate(order, customer, products);
                    try {
                        doc.render(invoiceData);
                    } catch (error: any) {
                        function replaceErrors(key: any, value: any) {
                            if (value instanceof Error) {
                                return Object.getOwnPropertyNames(value).reduce(function(
                                    error,
                                    key
                                ) {
                                    (error as any)[key] = (value as any)[key];
                                    return error;
                                },
                                {});
                            }
                            return value;
                        }

                        // Xem chi tiết lỗi ở Console
                        console.error('Lỗi chi tiết Docxtemplater:', JSON.stringify({error: error}, replaceErrors));

                        if (error.properties && error.properties.errors instanceof Array) {
                            const errorMessages = error.properties.errors.map(function (e: any) {
                                return e.properties.explanation;
                            }).join('\n');
                            console.error('Lỗi cú pháp Template:', errorMessages);
                            toast.error('Lỗi mẫu Word: ' + errorMessages);
                        } else {
                            toast.error(`Lỗi render biến vào hóa đơn: ${error.message}`);
                        }
                        return; // Dừng việc tải file nếu có lỗi
                    }

                    const out = doc.getZip().generate({
                        type: 'blob',
                        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    });

                    saveAs(out, `HoaDon_${order.orderName || order.id}.docx`);
                    toast.success('Xuất hóa đơn thành công!');
                })
                .catch(error => {
                    console.error('Lỗi khi xuất hóa đơn:', error);
                    toast.error(`Lỗi xuất hóa đơn: ${error.message}`);
                });
        } catch (error: any) {
            console.error('Lỗi khi xuất hóa đơn:', error);
            toast.error(`Lỗi xuất hóa đơn: ${error.message}`);
        }
    }

    private formatOrderDataForTemplate(order: any, customerEntity: any, products: any[]) {
        const orderDateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '';

        let subtotal = 0;

        // Map order items and calculate subtotal
        const orderItems = order.orderItems.map((item: any, index: number) => {
            subtotal += item.totalPrice;

            // Tìm chi tiết sản phẩm nếu có truyền vào
            let productName = item.productName || item.productId;
            let productSku = item.productSku || '';

            if (products && products.length > 0) {
                const p = products.find(prod => prod.id === item.productId || prod.id === item.product_id);
                if (p) {
                    productName = p.name;
                    productSku = p.code;
                }
            }

            return {
                stt: index + 1,
                product_name: productName,
                product_sku: productSku,
                quantity: item.quantity,
                unit_price: item.unitPrice ? item.unitPrice.toLocaleString('vi-VN') : '0',
                total_price: item.totalPrice ? item.totalPrice.toLocaleString('vi-VN') : '0'
            };
        });

        const paymentMethodMap: any = {
            'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
            'CASH': 'Tiền mặt',
            'CARD': 'Thẻ tín dụng'
        };

        const deliveryServiceMap: any = {
            'GHTK': 'Giao hàng tiết kiệm',
            'GHN': 'Giao hàng nhanh',
            'VIETTEL_POST': 'Viettel Post',
            'SELF': 'Tự giao'
        };

        const discountAmount = order.price < subtotal ? (subtotal - order.price) : 0;

        // Ưu tiên lấy từ order.shop nếu API có trả về object shop
        const shopData = order.shop || {
            name: 'Cửa hàng quần áo SMP',
            address: '123 Đường ABC, Quận 1, Hồ Chí Minh',
            phone: '0901234567'
        };

        // Lấy thông tin khách hàng từ cục API hoặc entity riêng
        const orderCustomer = order.customer || {};
        const customerData = {
            name: orderCustomer.name || customerEntity?.fullName || order.customerName || '',
            phone: orderCustomer.phone || customerEntity?.phoneNumber || '',
            address: orderCustomer.address || customerEntity?.address || ''
        };

        return {
            invoice_number: `INV-${order.orderName || Math.floor(Math.random() * 10000)}`,
            order_name: order.orderName || '',
            order_date: orderDateStr,

            "shop.name": shopData.name || '',
            "shop.address": shopData.address || '',
            "shop.phone": shopData.phone || '',

            "customer.name": customerData.name || '',
            "customer.phone": customerData.phone || '',
            "customer.address": customerData.address || '',

            order_items: orderItems,
            subtotal: subtotal.toLocaleString('vi-VN'),
            discount_amount: discountAmount.toLocaleString('vi-VN'),
            price: order.price ? order.price.toLocaleString('vi-VN') : '0',
            payment_method: paymentMethodMap[order.paymentMethod || order.paymentState] || order.paymentMethod || order.paymentState || 'Không xác định',
            delivery_service: deliveryServiceMap[order.deliveryService] || order.deliveryService || 'Không xác định',
            description: order.description || ''
        };
    }
}

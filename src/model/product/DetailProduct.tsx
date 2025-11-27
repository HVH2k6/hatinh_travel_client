'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MessageCircle, 
  Facebook, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Store, 
  MapPin, 
  ChevronRight,
  Check,
  Truck
} from 'lucide-react';

// Giả lập data từ props server trả về
const productData: any = {
    "_id": "6928ad699d9f7f1a2e08f20f",
    "name": "Chim Rừng Tự Nhiên (Đặc Sản)", // Mình sửa tên xíu cho hợp context du lịch
    "price": 59000000,
    "description": "<p>Chim rừng tự nhiên quý hiếm, phù hợp làm quà biếu tặng hoặc ngâm rượu. <br/> Đảm bảo nguồn gốc tự nhiên 100%.</p>",
    "image": "https://res.cloudinary.com/dceqnckf1/image/upload/v1764273497/qiwgweqhzkfxf1yolwxu.svg",
    "list_image": [
        "https://res.cloudinary.com/dceqnckf1/image/upload/v1764273510/jsf7t9fwef3ohjilgmqg.png",
        "https://res.cloudinary.com/dceqnckf1/image/upload/v1764273509/ysa33cdhw4kobjndhuoq.webp",
        "https://res.cloudinary.com/dceqnckf1/image/upload/v1764273509/nopr4lppxjdd8fys7h8y.webp",
        "https://res.cloudinary.com/dceqnckf1/image/upload/v1764273509/zsogzgb889ejk9ysmwip.svg",
        "https://res.cloudinary.com/dceqnckf1/image/upload/v1764273509/gijckfyyjnhf7sthmulg.svg"
    ],
    "unitId": {
        "_id": "69289f05287319ccec0428d5",
        "name": "Lít",
        "symbol": "L"
    },
    "shopId": {
        "contact": {
            "facebook": "https://gemini.google.com",
            "zalo": "",
            "phone": "0987654312"
        },
        "_id": "691e028a5bbc141a5f916743",
        "name": "Đồ Biển Việt Nam"
    },
    "createdAt": "2025-11-27T19:58:33.900Z",
    "slug": "chim-rung"
};

// Formatter tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function ProductDetailPage() {
  // Logic Gallery ảnh
  // Gộp ảnh đại diện và list_image thành 1 mảng để hiển thị
  const allImages = [productData.image, ...productData.list_image].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans text-slate-800">
      
      {/* 1. Breadcrumb (Điều hướng) */}
    
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* === CỘT TRÁI (GALLERY) - Chiếm 7 phần === */}
          <div className="lg:col-span-7 space-y-4">
            {/* Ảnh chính */}
            <div className="aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
               <img 
                 src={selectedImage} 
                 alt={productData.name} 
                 className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
                    <Heart className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* List ảnh nhỏ (Thumbnail) */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
               {allImages.map((img, index) => (
                 <button 
                   key={index}
                   onClick={() => setSelectedImage(img)}
                   className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}`}
                 >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>

            {/* Mô tả chi tiết (Đặt ở dưới ảnh trên Mobile/Desktop) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-green-600" />
                 Mô tả sản phẩm
               </h3>
               <div 
                 className="prose prose-slate max-w-none text-gray-600 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: productData.description }} 
               />
            </div>
          </div>

          {/* === CỘT PHẢI (INFO & ACTION) - Chiếm 5 phần === */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              
              {/* Card Thông tin Chính */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                 {/* Tên & Badge */}
                 <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-100 uppercase tracking-wide">
                           Đặc sản
                        </span>
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                           <Truck className="w-3 h-3" /> Ship toàn quốc
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                       {productData.name}
                    </h1>
                 </div>

                 {/* Giá & Đơn vị */}
                 <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-red-600">
                       {formatCurrency(productData.price)}
                    </span>
                    <span className="text-gray-500 font-medium text-lg">
                       / {productData.unitId.symbol}
                    </span>
                 </div>

                 {/* Thông tin Shop */}
                 <div className="flex items-center gap-4 p-4 border rounded-xl border-gray-100 bg-white mb-6 hover:border-blue-200 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                       {productData.shopId.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                       <p className="text-xs text-gray-500">Được bán bởi</p>
                       <h4 className="font-bold text-gray-900 capitalize flex items-center gap-1">
                          {productData.shopId.name}
                          <ShieldCheck className="w-4 h-4 text-blue-500" fill="currentColor" color="white" />
                       </h4>
                    
                    </div>
                    <button className="text-sm font-semibold text-blue-600 hover:underline">
                       <Link href={`/cua-hang/${productData.shopId.slug}`} className="block w-full">Xem Shop </Link>
                    </button>
                 </div>

                 {/* Nút Hành Động (CTA) */}
                 <div className="space-y-3">
                    <a 
                      href={`tel:${productData.shopId.contact.phone}`}
                      className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
                    >
                       <Phone className="w-5 h-5 fill-current" />
                       <span>Liên hệ: {productData.shopId.contact.phone}</span>
                    </a>

                    <div className="grid grid-cols-2 gap-3">
                       <button className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-3 rounded-xl transition-colors border border-blue-100">
                          <MessageCircle className="w-5 h-5" /> Chat Zalo
                       </button>
                       {productData.shopId.contact.facebook && (
                          <a 
                            href={productData.shopId.contact.facebook} 
                            target="_blank"
                            className="flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors border border-gray-200"
                          >
                             <Facebook className="w-5 h-5 text-[#1877F2]" /> Facebook
                          </a>
                       )}
                    </div>
                 </div>
              </div>
              
              
      

            </div>
          </div>
          
        </div>
      </main>
      
   
    </div>
  );
}
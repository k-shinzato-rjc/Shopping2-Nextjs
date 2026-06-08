"use client"

import React from "react";
import {use, useState} from "react";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

// メニューJsonデータ受け取り用 型
type Menu = {
    id : number
    commodityName : string
    price : number
}

export default function MenuList() {

    const router = useRouter();
    // メニューデータ格納用
    const[ menus , setMenus ] = useState<Menu[]>([]);

    const springUrl = "http://localhost:8080";

    useEffect(() => {
        const fetchData = async () => {

            console.log("通信開始");

            try{
                
                const response = await fetch(springUrl + "/menu/list", {credentials: "include"});

                if(!response.ok){
                    console.log("サーバーエラーが発生しました:", response.status);
                    return;
                }

                const json = await response.json();
                setMenus(json);

                console.log("メニュー一覧取得OK");

            }catch(error){
                console.log("通信失敗", error);
                return;
            }


        };

        fetchData();

    },[]);
    
    const addToCart = async (id : number) => {
        
        console.log("通信開始");

        try{
            const response = await fetch(springUrl + `/cart/order/add?id=${id}`, { method: 'POST', credentials: "include"});
            await response.text();

        }catch(error){
            console.log("通信失敗", error);
            return;
        }

        console.log("カートへ商品追加リクエストOK")
    };

    const clear = async () => {

        console.log("通信開始");

        try{
            const response = await fetch(springUrl + "/cart/all/clear",{credentials: "include"});
            await response.text();

        }catch(error){
            console.log("通信失敗" , error);
        }

        console.log("通信成功");
    };

    const clearConfilm = () => {
        const result = confirm("カートの中身を削除しますか？");
        if(!result){
            alert("キャンセルします")
            return false;
        }

        alert("カートの商品を削除しました！")
        return true;
    }

    // メニュー一覧画面
    return(
        <div className="min-h-screen bg-neutral-50 text-neutral-800 antialiased py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-neutral-200 pb-6 mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Online Store</h1>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => router.push("/cart")}
                            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors duration-200"
                        >
                            カートを見る
                        </button>
                        <button 
                            onClick={() => { const proceed = clearConfilm(); if(proceed) clear(); }}
                            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-red-600 bg-white border border-neutral-200 hover:border-red-200 rounded-lg shadow-sm transition-all duration-200"
                        >
                            カートの商品をクリアする
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {menus?.map((menu) => {
                        return(
                            <div 
                                key={menu?.id} 
                                className="group bg-white rounded-xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                <div className="aspect-square bg-neutral-100 relative overflow-hidden flex items-center justify-center text-neutral-300 group-hover:scale-105 transition-transform duration-300">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h2 className="font-semibold text-neutral-800 text-lg mb-1 line-clamp-2">
                                        {menu?.commodityName}
                                    </h2>
                                    <p className="text-neutral-900 font-bold text-base mb-4 mt-auto">
                                        ¥{menu?.price?.toLocaleString()}
                                    </p>
                                    <button 
                                        onClick={() => addToCart(menu?.id)}
                                        className="w-full bg-neutral-50 hover:bg-neutral-900 text-neutral-800 hover:text-white font-medium py-2.5 px-4 rounded-md border border-neutral-200 hover:border-neutral-900 transition-all duration-200 text-sm"
                                    >
                                        追加
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
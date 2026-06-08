"use client"

import React from "react";
import {useState} from "react";
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
                                <div className="aspect-square bg-neutral-100 relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={
                                                　menu?.id === 1
                                                ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgNtUR1ksjXGJrJuKvasxsxzXsmHg19Sijij3bYh-ad9Zlyt__d2uGbMOkx06LR55mYWc270w5WBssx5lYz6qd21RT4mDJLy9ppwDNkxI19xhPMWsTwarzDSSADvK8N1zPf9txO0WmF8NOL/s400/fruit_banana_character.png"
                                                : menu?.id === 2
                                                ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4XgoY3TV5K-XWwDBGigF8g4j410bWlgXZiB8pW2ooY7SvGwcgiGBR2pH2Wk9qNiB-Hnz6rsN246p3qSXhwryrVpK_9HUcwzQaT37LtVPgDUBwlg2B3Xq8aDoRw4c_eA_ttQYEylVdqx_d/s400/character_apple.png"
                                                : menu?.id === 3
                                                ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipfSiHWnrcxKv8voU7A9VO7vTQA5ILTOrR_V4q2ZIYZQKC_AAjbVvDhDXY225_Pu5mYM3f2GveXfixjmNBFW0QrUDDfJoPaaOqEW0Ori8m2TzgXMnNs_f6BQ-Yfb7oW_tuGL4Rz4A6arRY/s400/character_pineapple.png"
                                                : "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgNtUR1ksjXGJrJuKvasxsxzXsmHg19Sijij3bYh-ad9Zlyt__d2uGbMOkx06LR55mYWc270w5WBssx5lYz6qd21RT4mDJLy9ppwDNkxI19xhPMWsTwarzDSSADvK8N1zPf9txO0WmF8NOL/s400/fruit_banana_character.png" 
                                        }
                                        alt={menu?.commodityName}
                                        className="w-full h-full object-contain p-4"
                                    />
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
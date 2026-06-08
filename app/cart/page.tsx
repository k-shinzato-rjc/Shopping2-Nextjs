"use client";

import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Order = {
  commodityId: number;
  quantity: number;
  menu: {
    id: number;
    commodityName: string;
    price: number;
  };
};

export default function CartList() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  // SpringBootプロジェクト パス
  const springUrl = "http://localhost:8080";

  // SpringBootを経由してDBからカート情報を取得 → ステートメントへ格納
  // ページアクセス時のみ実行
  useEffect(() => {
    const cartListFetch = async () => {
      try {
        const response = await fetch(springUrl + "/cart/list", {
          credentials: "include",
        });

        const json = await response.json();
        setOrders(json);

        //テスト
        console.log("カート一覧リクエスト");
      } catch (error) {
        console.log("エラー", error);
        return;
      }
    };

    cartListFetch();
  }, []);

  // カート情報（ステートメント）更新される度に合計金額を計算
  const sumMonery = useMemo(() => {
    return orders.reduce((sum, order) => {
      const price = order.menu.price || 0;
      const quantity = order.quantity || 0;
      return sum + price * quantity;
    }, 0);
  }, [orders]);

  // セレクトボックス数量を選択 → SpringBootセッション内 商品データを変更 → セッションデータ（カートリスト)を受け取る → ステイトメントに反映
  const changeQuantity = async (commodityId: number, quantity: number) => {
    try {
      const response = await fetch(
        springUrl +
          `/cart/quantity/change?commodityId=${commodityId}&quantity=${quantity}`,
        { method: "post", credentials: "include" }
      );

      if (!response.ok) {
        console.log("通信失敗", response);
        return;
      }

      const json = await response.json();
      setOrders(json);
    } catch (error) {
      console.log("エラー", error);
      return;
    }
  };

  // SpringBootのセッションからIDに該当した商品を削除 → セッションデータ（カート内商品リスト）を受け取る → ステイトメントに反映
  const deleteCommodity = async (commodityId: number) => {
    try {
      const response = await fetch(
        springUrl + `/cart/order/delete?commodityId=${commodityId}`,
        { method: "post", credentials: "include" }
      );

      if (!response.ok) {
        console.log("通信失敗", response);
        return;
      }

      const json = await response.json();
      setOrders(json);
    } catch (error) {
      console.log("エラー", error);
      return;
    }
  };

  // セッションのデータをDBに反映させる
  const registCart = async () => {
    console.log("通信開始");
    try {
      const response = await fetch(springUrl + "/cart/regist", {
        credentials: "include",
      });
      await response.text();
    } catch (error) {
      console.log("エラー", error);
      return;
    }

    console.log("セッション内容をDBへ反映");
  };

  // 購入ボタン押下 → カートの中身を削除 → DBに反映
  const purchase = async () => {
    try {
      const response = await fetch(springUrl + "/cart/purchase", {
        credentials: "include",
      });

      console.log("通信開始");

      if (!response.ok) {
        console.log("通信失敗", response);
        return;
      }

      const json = await response.json();
      setOrders(json);
    } catch (error) {
      console.log("エラー", error);
    }

    console.log("DB内削除");
  };

  const registAlert = () => {
    alert("一時保存しました！");
  };

  const purchaseConfilm = () => {
    const result = confirm("本当に本当に本当に購入しますか？");

    if (!result) {
      alert("本当にキャンセルするんですね？");
      return false;
    }

    alert("本当に購入したんですね・・");
    return true;
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-8 border-b border-neutral-200 pb-4">
          お野菜ボックス
        </h1>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 text-xs uppercase tracking-wider bg-neutral-50/50">
                <th className="py-4 px-6 font-medium">商品名</th>
                <th className="py-4 px-3 font-medium text-right">単価</th>
                <th className="py-4 px-3 font-medium text-center">個数</th>
                <th className="py-4 px-3 font-medium text-right">小計</th>
                <th className="py-4 px-6 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {orders.map((order) => {
                return (
                  <tr
                    key={order.commodityId}
                    className="hover:bg-neutral-50/40 transition-colors duration-150"
                  >
                    <td className="py-5 px-6 font-medium text-neutral-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            order.commodityId === 1
                              ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgNtUR1ksjXGJrJuKvasxsxzXsmHg19Sijij3bYh-ad9Zlyt__d2uGbMOkx06LR55mYWc270w5WBssx5lYz6qd21RT4mDJLy9ppwDNkxI19xhPMWsTwarzDSSADvK8N1zPf9txO0WmF8NOL/s400/fruit_banana_character.png"
                              : order.commodityId === 2
                              ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4XgoY3TV5K-XWwDBGigF8g4j410bWlgXZiB8pW2ooY7SvGwcgiGBR2pH2Wk9qNiB-Hnz6rsN246p3qSXhwryrVpK_9HUcwzQaT37LtVPgDUBwlg2B3Xq8aDoRw4c_eA_ttQYEylVdqx_d/s400/character_apple.png"
                              : order.commodityId === 3
                              ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipfSiHWnrcxKv8voU7A9VO7vTQA5ILTOrR_V4q2ZIYZQKC_AAjbVvDhDXY225_Pu5mYM3f2GveXfixjmNBFW0QrUDDfJoPaaOqEW0Ori8m2TzgXMnNs_f6BQ-Yfb7oW_tuGL4Rz4A6arRY/s400/character_pineapple.png"
                              : "/fruit_banana_character.png"
                          }
                          alt={order.menu.commodityName}
                          className="w-8 h-8 object-contain"
                        />
                        <span>{order.menu.commodityName}</span>
                      </div>
                    </td>
                    <td className="py-5 px-3 text-right text-neutral-600">
                      ¥{order.menu.price.toLocaleString()}
                    </td>
                    <td className="py-5 px-3 text-center">
                      <select
                        value={order.quantity}
                        onChange={(e) =>
                          changeQuantity(
                            order?.commodityId,
                            Number(e.target.value)
                          )
                        }
                        className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-neutral-400 text-neutral-700"
                      >
                        {[...Array(50)].map((_, index) => {
                          const num = index + 1;

                          return (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="py-5 px-3 text-right font-semibold text-neutral-900">
                      ¥{(order.menu.price * order.quantity).toLocaleString()}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button
                        onClick={() => deleteCommodity(order?.commodityId)}
                        className="text-xs font-medium text-neutral-400 hover:text-red-600 transition-colors duration-150"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-end gap-6 bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <div className="flex justify-between items-baseline w-full sm:w-80 border-b border-neutral-100 pb-4">
            <span className="text-sm font-medium text-neutral-500">
              合計金額
            </span>
            <span className="text-2xl font-bold text-neutral-900">
              ¥{sumMonery.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push("/menu")}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg shadow-sm transition-all duration-200 order-3 sm:order-1"
            >
              カートに戻る
            </button>
            <button
              onClick={() => {registAlert(); registCart();}}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg shadow-sm transition-all duration-200 order-2"
            >
              一時保存
            </button>
            <button
              onClick={() => {
                const proceed = purchaseConfilm();
                if(proceed) purchase();
              }}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors duration-200 order-1 sm:order-3"
            >
              購入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
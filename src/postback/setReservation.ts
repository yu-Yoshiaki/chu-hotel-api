import { FlexMessage, Message, TemplateMessage } from "@line/bot-sdk";
import { supabase } from "../supabase";
import { definitions } from "../type/supabase";
import dayjs from "dayjs";
type Data = { date: string; member: number; lineid: string; status: "予約済み" };

export const setReservation = async (date: string, member: number, lineid: string) => {
  const data: Data[] = [{ date, member, lineid, status: "予約済み" }];
  const { data: reservation, error } = await supabase
    .from<definitions["reserve"]>("reserve")
    .insert(data)
    .single();

  if (error)
    return {
      type: "text",
      text: error.message,
    } as Message;

  const message: FlexMessage = {
    type: "flex",
    altText: "this is a confirm template",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
        size: "full",
        aspectRatio: "20:10",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "予約を受け付けました。",
            weight: "bold",
            size: "xl",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "md",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "md",
                contents: [
                  {
                    type: "text",
                    text: "予約番号",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: reservation.reserveid,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 3,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "md",
                contents: [
                  {
                    type: "text",
                    text: "予約日",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: dayjs(reservation.date).format("M月D日"),
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 3,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "md",
                contents: [
                  {
                    type: "text",
                    text: "人数",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: `${reservation.member}名`,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 3,
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                spacing: "md",
                contents: [
                  {
                    type: "text",
                    text: "当日の流れ",
                    color: "#aaaaaa",
                    size: "sm",
                  },
                  {
                    type: "text",
                    text: "上記に記載された予約番号を受付にお見せください。",
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "md",
                contents: [
                  {
                    type: "text",
                    text: "それでは当日お待ちしております。",
                    size: "md",
                    weight: "bold",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };
  return message;
};

export const confirmReservation = (date: string, member: number) => {
  const message: FlexMessage = {
    type: "flex",
    altText: "this is a confirm template",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "入力情報の確認",
            weight: "bold",
            size: "xl",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "md",
                contents: [
                  {
                    type: "text",
                    text: "予約日",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: dayjs(date).format("M月D日"),
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 3,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "md",
                contents: [
                  {
                    type: "text",
                    text: "人数",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: `${member}名`,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 3,
                  },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "separator",
          },
          {
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "postback",
              label: "確定",
              data: `action=reserve&date=${date}&member=${member}&confirm=true`,
              displayText: `予約を確定する`,
            },
          },
        ],
        flex: 0,
      },
    },
  };
  return message;
};

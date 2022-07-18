/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from "@line/bot-sdk";

export const inputDate: Message[] = [
  {
    type: "template",
    altText: "This is a buttons template",
    template: {
      type: "buttons",
      text: "予約日を決める。",
      actions: [
        {
          type: "datetimepicker",
          mode: "date",
          label: "予約日を決める。",
          data: "action=reserve&date=confirm",
        },
      ],
    },
  },
];

export const confirmDate: (event: any) => Message[] = (event) => [
  {
    type: "template",
    altText: "this is a confirm template",
    template: {
      type: "confirm",
      text: `${event.postback.params.date}でよろしいでしょうか？`,
      actions: [
        {
          type: "message",
          label: "はい",
          text: "はい",
        },
        {
          type: "message",
          label: "いいえ",
          text: "no",
        },
      ],
    },
  },
];
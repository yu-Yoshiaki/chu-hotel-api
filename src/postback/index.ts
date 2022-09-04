/* eslint-disable @typescript-eslint/no-explicit-any */
import { Postback } from "@line/bot-sdk";
import { client } from "../client";
import { cancelReservation } from "./cancelReservation";
import { setMember } from "./setMember";
import { confirmReservation, setReservation } from "./setReservation";

export const poctback = (event: any) => {
  const poctbackData: Postback["data"] = event.postback.data;
  if (/reservation=cancel&reserveid=.*&confirm=(false|true)/.test(poctbackData)) {
    cancelReservation(poctbackData, event.replyToken);
  } else if (
    /action=reserve&date=20[0-9]{2}-[0-9]{1,}-[0-9]{1,}&member=[0-9]{1,}&confirm=(false|true)/.test(
      poctbackData
    )
  ) {
    const data = poctbackData.split(/action=reserve&date=|&member=|&confirm=/);
    const date = data[1];
    const member = Number(data[2]);
    const confirm = data[3] as "true" | "false";

    if (confirm === "false") {
      return client.replyMessage(event.replyToken, confirmReservation(date, member));
    }

    setReservation(date, member, event.source.userId).then((message) => {
      return client.replyMessage(event.replyToken, message);
    });
  } else if (/action=reserve&date=20[0-9]{2}-[0-9]{1,}-[0-9]{1,}/.test(poctbackData)) {
    return client.replyMessage(event.replyToken, setMember(poctbackData));
  } else {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "error",
    });
  }
};

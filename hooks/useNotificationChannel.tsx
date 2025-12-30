"use client";

import { useEffect, useRef } from "react";
import { Notification } from "@/type/type";
import type  ActionCable from "actioncable";
import { tokenStore } from "@/lib/api/tokenStore";

export function useNoficationChannel(onReceived: (noti: Notification) => void) {
  const cableRef = useRef<ActionCable.Cable | null>(null);
  const subscriptionRef = useRef<ActionCable.Channel | null>(null);

  useEffect(() => {
    const token = tokenStore.get()
    if (!token) {
      console.warn("No token → skip cable connect");
      return;
    }
    // Import động ActionCable
    import("actioncable").then((ActionCable) => {
      const cable = ActionCable.default.createConsumer(
        `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`
      );
      cableRef.current = cable;

      const subscription = cable.subscriptions.create(
        { channel: "NotificationsChannel" },
        {
          connected() {
          },
          disconnected() {
          },
          rejected() {
          },
          received(data: Notification) {
            onReceived(data);
          },
        }
      );
      subscriptionRef.current = subscription;
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
      cableRef.current?.disconnect();
    };
  }, [onReceived]);
}

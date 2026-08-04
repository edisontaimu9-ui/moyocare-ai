import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  saveDeviceToken, logNotification, subscribeNotifications, markNotificationsRead,
} from "./notifications.js";
import {
  requestNotificationPermission, currentPermissionState, onForegroundMessage, NotificationSetupError,
} from "./messaging.js";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(currentPermissionState());
  const [panelOpen, setPanelOpen] = useState(false);
  const [enabling, setEnabling] = useState(false);
  const [enableError, setEnableError] = useState("");

  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    return subscribeNotifications(user.uid, 30, setNotifications, () => {});
  }, [user]);

  // Log + surface pushes that arrive while the app is open. Background
  // (OS-delivered) pushes are handled by src/sw.js instead.
  useEffect(() => {
    if (!user) return;
    let unsub = () => {};
    onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      logNotification(user.uid, { title: title || "MoyoCare AI", body: body || "", data: payload.data || {} });
    }).then((fn) => { unsub = fn; });
    return () => unsub();
  }, [user]);

  const enablePush = async () => {
    if (!user) return;
    setEnabling(true);
    setEnableError("");
    try {
      const token = await requestNotificationPermission();
      setPermission(currentPermissionState());
      if (token) await saveDeviceToken(user.uid, token);
    } catch (err) {
      setEnableError(err instanceof NotificationSetupError ? err.message : "Couldn't enable notifications. Try again.");
    } finally {
      setEnabling(false);
    }
  };

  const openPanel = () => {
    setPanelOpen(true);
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (user && unreadIds.length > 0) markNotificationsRead(user.uid, unreadIds);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications, unreadCount, permission, panelOpen,
        enabling, enableError,
        enablePush, openPanel, closePanel: () => setPanelOpen(false),
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

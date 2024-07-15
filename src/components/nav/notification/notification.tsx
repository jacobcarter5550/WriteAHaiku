import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface NotificationItem {
  label: string;
  link: string;
  id: number;
}

interface NotificationDropdownProps {
  open: boolean;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  anchor: HTMLImageElement;
}

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    textTransform: "none",
    fontWeight: "bold",
    backgroundColor: "transparent",
    boxShadow: "none",
    border: "0",
  },
  notificationItem: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  viewDetailsLink: {
    border: "1px solid #383C93",
    color: "#383C93",
    fontSize: "10px",
    borderRadius: "4px",
    width: "80px",
    display: "block",
    textAlign: "center",
    padding: "5px 0",
    textDecoration: "none",
  },
  viewDetailsLinkHeader: {
    position: "absolute",
    right: "12px",
    top: "35px",
    color: "#383C93",
    textDecoration: "none",
  },
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  open,
  close,
  anchor,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      label: "Market: Nvidia price rise 12% (US $75)",
      id: 1,
      link: "google.com",
    },
    {
      label: "Market: Nvidia price rise 12% (US $75)",
      id: 2,
      link: "google.com",
    },
    {
      label: "Market: Nvidia price rise 12% (US $75)",
      id: 3,
      link: "google.com",
    },
    {
      label: "Market: Nvidia price rise 12% (US $75)",
      id: 4,
      link: "google.com",
    },
    {
      label: "Market: Nvidia price rise 12% (US $75)",
      id: 5,
      link: "google.com",
    },
  ]);

  const handleClose = () => {
    close(false);
  };

  return (
    <Menu
      id="notification-menu"
      anchorEl={anchor}
      keepMounted
      open={open}
      onClose={handleClose}
    >
      <MenuItem>
        <div className="notification-header">
          <h3>Notifications</h3>
          <p>Here is a list of activities which need your attention.</p>
          <a href="#" style={styles.viewDetailsLinkHeader}>
            Mark as Read
          </a>
        </div>
      </MenuItem>
      {notifications.map((notification) => (
        <MenuItem
          style={{ width: "550px", borderBottom: "1px solid #E0E0E0" }}
          key={notification.id}
          onClick={handleClose}
        >
          <div style={styles.notificationItem}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/profileNotification.png"
                alt="Notification Profile"
              />
              <label style={{ paddingLeft: "10px", fontSize: "1.6rem" }}>
                {notification.label}
              </label>
            </div>
            <div>
              <a
                href={notification.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.viewDetailsLink}
              >
                View Details
              </a>
            </div>
          </div>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default NotificationDropdown;

import digifairLogo from "../../assets/company_logos/digifair_icon_notification.png";
import notificationSound from "../../assets/audio/anxious.mp3";

const sendNotification = (title, body) => {
  // Notification

  let notification = new Notification(title, {
    body: body,
    icon: digifairLogo,
  });
  const audio = new Audio(notificationSound);

  audio.play();

  notification.onclick = () => {
    document.title = "Dashboard";
    window.focus(); // Redirects to the window
  };
  document.title = "Digifair (1)";
};
export default sendNotification;

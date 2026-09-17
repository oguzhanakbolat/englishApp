import { CDN_URL } from "@/services";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import dateFormatter, { dateFormatterWithTime } from "./date";


export const generatePDF = async (work: any | null) => {
    if (!work) return;
  
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>İş Detayı</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            h1 { color: #333; font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #555; font-size: 14px; margin-top: 14px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
            .date { float: right; font-size: 12px; color: #666; }
            .row2 { display: flex; justify-content: space-between; width: 100%; gap-x: 2%; flex-wrap: wrap; }
            .row { display: flex; padding: 5px 0; border-bottom: 1px solid #eee; width: 48%; }
            .rowFull { display: flex; padding: 4px 0; border-bottom: 1px solid #eee; width: 100%; }
            .label {font-size: 14px; color: #666; font-weight: bold; padding-right: 7px; }
            .value {font-size: 14px; color: #333; }
            .images { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
            .images img { width: 134px; height: 90px; object-fit: cover; border: 1px solid #ddd; }
            .process-item { padding: 5px 0; }
          </style>
        </head>
        <body>
          <h1><span>LOCKSMITH - İş Kaydı</span> <span class="date">${dateFormatterWithTime(work?.createdAt) || "-"}</span></h1>
          <div class="row" ><span class="label">İşlemi Yapan:</span><span class="value">${work?.user || "-"} / ${work?.userPhone || "-"}</span></div>
          <h2>Kimlik Bilgileri</h2>
          <div class="row2">
            <div class="row"><span class="label">TCKN:</span><span class="value">${work?.tckn || "-"}</span></div>
            <div class="row"><span class="label">Adı Soyadı:</span><span class="value">${work?.name || "-"}</span></div>
            <div class="row"><span class="label">Doğum Tarihi:</span><span class="value">${dateFormatter(work?.birthdate) || "-"}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${work?.email || "-"}</span></div>
            <div class="row"><span class="label">Telefon:</span><span class="value">${work?.phone || "-"}</span></div>
            <div class="row"><span class="label">Adres:</span><span class="value">${work?.address ? `${work?.address} ${work?.district}/${work?.city}` : "-"} ${work?.address ? `${work?.address} ${work?.district}/${work?.city}` : "-"}</span></div>
          </div>
          <h2>Ruhsat Bilgileri</h2>
          <div class="row2">
            <div class="row"><span class="label">Marka / Model:</span><span class="value">${work?.brand && work?.model ? `${work?.brand} / ${work?.model}` : "-"}</span></div>
            <div class="row"><span class="label">Yıl:</span><span class="value">${work?.year || "-"}</span></div>
            <div class="row"><span class="label">Plaka:</span><span class="value">${work?.plate || "-"}</span></div>
            <div class="row"><span class="label">Şasi Numarası:</span><span class="value">${work?.chassisNumber || "-"}</span></div>
            <div class="row"><span class="label">Ruhsat Sahibi:</span><span class="value">${work?.name || "-"}</span></div>
            <div class="row"><span class="label">TCKN:</span><span class="value">${work?.tckn || "-"}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${work?.email || "-"}</span></div>
            <div class="row"><span class="label">Telefon:</span><span class="value">${work?.phone || "-"}</span></div>
            <div class="row"><span class="label">Adres:</span><span class="value">${work?.address ? `${work?.address} ${work?.district}/${work?.city}` : "-"}</span></div>
          </div>
          <h2>Yapılan İşlemler</h2>
          <div class="row2">
            <div class="row">${work?.process ? work?.process.split(",").map((op: string, i: number) => `<div class="process-item">${i + 1}. ${op}</div>`).join("") : "-"}</div>
            <div class="row"><span class="label">Notlar:</span><span class="value">${work?.note || "-"}</span></div>
            <div class="row"><span class="label">Ücret:</span><span class="value">${work?.payment ? work?.payment + " TL" : "-"}</span></div>
          </div>
          <h2>Zorunlu Bilgiler</h2>
          <div class="row2">
            ${work?.km ? `<div class="row"><span class="label">Kilometre:</span><span class="value">${work?.km}</span></div>` : ""}
            ${work?.mechanicalPasswordCode ? `<div class="row"><span class="label">Mekanik Şifre:</span><span class="value">${work?.mechanicalPasswordCode}</span></div>` : ""}
            ${work?.pinCode ? `<div class="row"><span class="label">PIN Kodu:</span><span class="value">${work?.pinCode}</span></div>` : ""}
            ${work?.csCode ? `<div class="row"><span class="label">CS Kodu:</span><span class="value">${work?.csCode}</span></div>` : ""}
            ${work?.piece ? `<div class="row"><span class="label">Anahtar Sayısı:</span><span class="value">${work?.piece}</span></div>` : ""}
          </div>
          <h2>Fotoğraflar</h2>
          <div class="images">
            ${work?.idCardFront ? `<img src="${CDN_URL}${work?.idCardFront}" />` : ""}
            ${work?.idCardBack ? `<img src="${CDN_URL}${work?.idCardBack}" />` : ""}
            ${work?.registrationImage ? `<img src="${CDN_URL}${work?.registrationImage}" />` : ""}
            ${work?.beforeImages ? work?.beforeImages.split(",").map((img: string) => `<img src="${CDN_URL}${img}" />`).join("") : ""}
            ${work?.plateImage ? `<img src="${CDN_URL}${work?.plateImage}" />` : ""}
            ${work?.gaugeImage ? `<img src="${CDN_URL}${work?.gaugeImage}" />` : ""}
            ${work?.generalImage ? `<img src="${CDN_URL}${work?.generalImage}" />` : ""}
          </div>
        </body>
      </html>
    `;
  
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      console.error("PDF oluşturma hatası:", error);
    }
  };
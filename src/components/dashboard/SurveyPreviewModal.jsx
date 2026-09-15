import React, { useState } from 'react';
import {
  X,
  Radio as RadioIcon,
  MapPin,
  User,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  ZoomIn,
  Image as ImageIcon,
  Printer,
  FileText,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function SurveyPreviewModal({
  isOpen,
  onClose,
  surveyData = {},
  onOpenOfficialReport
}) {
  const [copied, setCopied] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  if (!isOpen) return null;

  const rawFields = surveyData.fields || {};
  const fields = { ...rawFields, ...surveyData, ...rawFields };

  const recordId = fields.recordId || fields.record_id || '-';
  const stationName = fields.station || fields.village || fields.stationSelect || 'สถานีวิทยุคมนาคม NBTC Microwave';
  const province = fields.province || '';
  const district = fields.district || '';
  const subdistrict = fields.subdistrict || '';
  const installationPlace = fields.installationPlace || fields.installation_place || '-';
  const equipmentPlace = fields.equipmentPlace || fields.equipment_place || installationPlace || '-';

  // Format full location
  const locationParts = [];
  if (installationPlace && installationPlace !== '-') locationParts.push(installationPlace);
  if (subdistrict) {
    const cleanSub = subdistrict.replace(/^ต\./, '').trim();
    if (cleanSub) locationParts.push(`ต.${cleanSub}`);
  }
  if (district) {
    const cleanDist = district.replace(/^อ\./, '').trim();
    if (cleanDist) locationParts.push(`อ.${cleanDist}`);
  }
  if (province) {
    const cleanProv = province.replace(/^จ\./, '').trim();
    if (cleanProv) locationParts.push(`จ.${cleanProv}`);
  }
  const fullLocation = locationParts.length > 0 ? locationParts.join(' ') : (fields.village || fields.station || '-');

  // Visit Date & Time
  const visitDateStr = fields.visitDate
    ? new Date(fields.visitDate).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : (fields.savedAt
      ? new Date(fields.savedAt).toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : '-');
  const visitTime = fields.visitTime ? `${fields.visitTime} น.` : (
    fields.savedAt ? new Date(fields.savedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' : '-'
  );

  // Contact Info
  const contactName = fields.contactName || fields.contact_name || fields.informantName || '-';
  const contactPosition = fields.contactPosition || fields.contact_position || 'เจ้าของพื้นที่ / ผู้ดูแลสถานี';
  const contactVillage = fields.contactVillage || (subdistrict ? `ต.${subdistrict.replace(/^ต\./, '')}` : '-');
  const contactPhone = fields.contactPhone || '-';

  // Permission
  const permit = fields.permit || 'อนุญาต';
  const isPermitted = permit === 'อนุญาต' || permit === 'on';
  const accessLimit = fields.accessLimit || 'ไม่มีข้อจำกัด';

  // Assessment fields
  const radioStatus = fields.radioStatus || 'ปกติ';
  const isRadioNormal = radioStatus === 'ปกติ';

  const receiveStatus = fields.receiveStatus || 'ไม่พบ';
  const isReceiveNormal = receiveStatus === 'ไม่พบ' || receiveStatus === 'ไม่พบปัญหา';

  const transmitStatus = fields.transmitStatus || 'ไม่พบ';
  const isTransmitNormal = transmitStatus === 'ไม่พบ' || transmitStatus === 'ไม่พบปัญหา';

  const powerStatus = fields.powerStatus || 'ไม่มี';
  const isPowerNormal = powerStatus === 'ไม่มี' || powerStatus === 'ไม่มีปัญหา';

  const batteryStatus = fields.batteryStatus || 'ไม่มี';
  const isBatteryNormal = batteryStatus === 'ไม่มี' || batteryStatus === 'ไม่มีปัญหา';

  const userProblem = fields.userProblem || 'ไม่พบปัญหาเพิ่มเติม';
  const siteCondition = fields.siteCondition || 'สภาพพื้นที่ปกติ พร้อมสำหรับการปฏิบัติงาน';
  const antennaCondition = fields.antennaCondition || 'สภาพเสาและสายอากาศอยู่ในเกณฑ์ปกติ';
  const workObstacle = fields.workObstacle || 'ไม่มีอุปสรรคในการปฏิบัติงาน';
  const summary = fields.summary || 'เจ้าของพื้นที่ให้ความร่วมมือในการเข้าตรวจเยี่ยมและตรวจสอบสภาพระบบอุปกรณ์เป็นอย่างดี';
  const informantName = fields.informantName || (contactName !== '-' ? contactName : '');
  const operatorName = fields.operatorName || 'วิศวกรผู้ควบคุมงาน';

  // Photos
  const photos = Array.isArray(surveyData.photos) && surveyData.photos.length > 0
    ? surveyData.photos
    : (Array.isArray(fields.photos) && fields.photos.length > 0 ? fields.photos : []);

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Copy Record ID
  const handleCopyRecordId = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(recordId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download Single Photo
  const handleDownloadPhoto = (photo, e) => {
    if (e) e.stopPropagation();
    const downloadUrl = photo.url
      ? (photo.url.includes('?') ? `${photo.url}&download=1` : `${photo.url}?download=1`)
      : (photo.dataUrl || photo.url);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = photo.name || `survey-photo-${photo.id || Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download All Photos
  const handleDownloadAllPhotos = () => {
    photos.forEach((photo, idx) => {
      setTimeout(() => {
        handleDownloadPhoto(photo);
      }, idx * 300);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-blue-500/30 bg-slate-900 shadow-2xl overflow-hidden my-auto text-slate-200">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <RadioIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white truncate">
                  {stationName}
                </h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isPermitted
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                }`}>
                  {isPermitted ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {isPermitted ? 'อนุญาตเข้าพื้นที่' : 'ไม่อนุญาต'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>รหัสรายการ:</span>
                <span className="font-mono text-cyan-400 font-semibold">{recordId}</span>
                <button
                  type="button"
                  onClick={handleCopyRecordId}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="คัดลอกรหัสรายการ"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {onOpenOfficialReport && (
              <button
                type="button"
                onClick={() => {
                  onOpenOfficialReport(surveyData);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-600/20 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600/30 hover:border-blue-400 hover:text-white transition-all cursor-pointer shadow-sm"
                title="เปิดแบบฟอร์มรายงานทางการ A4 สำหรับพิมพ์หรือส่งออก PDF"
              >
                <Printer className="h-3.5 w-3.5 text-cyan-400" />
                <span>พิมพ์ / Export PDF</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-slate-900/60 to-slate-950">
          
          {/* Section 1: Station & Location Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
            <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2.5 mb-3">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span>1. ข้อมูลสถานีและสถานที่ติดตั้ง (Station & Location)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">ชื่อสถานี</span>
                <span className="font-semibold text-white text-sm">{stationName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">สถานที่วางเครื่อง</span>
                <span className="font-medium text-slate-200">{equipmentPlace}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-400 block mb-0.5">สถานที่ติดตั้ง</span>
                <span className="font-medium text-slate-200">{fullLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">วันที่ตรวจเยี่ยม</span>
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {visitDateStr}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">เวลาที่ตรวจเยี่ยม</span>
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {visitTime}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Permission Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
            <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2.5 mb-3">
              <User className="h-4 w-4 text-cyan-400" />
              <span>2. ข้อมูลผู้ให้ข้อมูล / เจ้าของพื้นที่ และการขออนุญาต (Site Owner & Permission)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">ชื่อ - สกุล</span>
                <span className="font-semibold text-white text-sm">{contactName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">ตำแหน่ง</span>
                <span className="font-medium text-slate-200">{contactPosition}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">หน่วยงาน / หมู่บ้าน</span>
                <span className="font-medium text-slate-200">{contactVillage}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">เบอร์โทรศัพท์</span>
                {contactPhone && contactPhone !== '-' ? (
                  <a
                    href={`tel:${contactPhone}`}
                    className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {contactPhone}
                  </a>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">ผลการขออนุญาตเข้าพื้นที่</span>
                <span className={`inline-flex items-center gap-1.5 font-semibold px-2.5 py-0.5 rounded-lg text-xs ${
                  isPermitted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {isPermitted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  <span>{isPermitted ? 'อนุญาตให้เข้าพื้นที่' : 'ไม่อนุญาตให้เข้าพื้นที่'}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">ข้อจำกัดในการเข้าพื้นที่</span>
                <span className="font-medium text-slate-200">{accessLimit}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Equipment Assessment */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
            <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2.5 mb-3">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>3. ผลการตรวจสอบและประเมินสภาพระบบอุปกรณ์ (Equipment Assessment)</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-2.5">รายการประเมิน</th>
                    <th className="py-2 px-2.5 text-center">สถานะ</th>
                    <th className="py-2 px-2.5">รายละเอียด / ข้อสังเกต</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2 px-2.5 font-medium text-slate-200">1. สภาพการทำงานของเครื่องวิทยุคมนาคม</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                        isRadioNormal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {radioStatus}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400">{isRadioNormal ? 'เครื่องวิทยุทำงานปกติ' : 'พบข้อขัดข้องในการใช้งาน'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-medium text-slate-200">2. ภาครับสัญญาณ (Receiver Status)</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                        isReceiveNormal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {receiveStatus}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400">{isReceiveNormal ? 'รับสัญญาณได้ชัดเจน' : 'สัญญาณขาดหาย/มีสัญญาณรบกวน'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-medium text-slate-200">3. ภาคส่งสัญญาณ (Transmitter Status)</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                        isTransmitNormal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {transmitStatus}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400">{isTransmitNormal ? 'ส่งสัญญาณออกอากาศได้ตามปกติ' : 'กำลังส่งตก/ส่งสัญญาณไม่ได้'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-medium text-slate-200">4. ระบบไฟฟ้าหลัก (Power Supply)</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                        isPowerNormal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {powerStatus}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400">{isPowerNormal ? 'ระบบไฟฟ้าจ่ายไฟสม่ำเสมอ' : 'ระบบไฟฟ้าขัดข้อง/ไฟตกบ่อย'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-medium text-slate-200">5. แบตเตอรี่สำรอง (Backup Battery)</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                        isBatteryNormal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {batteryStatus}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-400">{isBatteryNormal ? 'แบตเตอรี่สำรองพร้อมจ่ายไฟ' : 'แบตเตอรี่เสื่อม/เก็บไฟไม่อยู่'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-medium text-slate-400">ปัญหาเพิ่มเติมที่ผู้ใช้งานแจ้ง</td>
                    <td colSpan={2} className="py-2 px-2.5 text-slate-200">{userProblem}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Site Environmental & Summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
            <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2.5 mb-3">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>4. สภาพแวดล้อมและสรุปผล (Environment & Summary)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">สภาพพื้นที่ติดตั้งอุปกรณ์</span>
                <span className="font-medium text-slate-200">{siteCondition}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">สภาพเสาอากาศและสายอากาศ</span>
                <span className="font-medium text-slate-200">{antennaCondition}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-400 block mb-0.5">อุปสรรคและข้อจำกัดในการปฏิบัติงาน</span>
                <span className="font-medium text-slate-200">{workObstacle}</span>
              </div>
              <div className="md:col-span-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-1 font-semibold">สรุปผลการตรวจเยี่ยมและข้อคิดเห็น</span>
                <p className="text-slate-200 leading-relaxed">{summary}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">ผู้ให้ข้อมูล / เจ้าของพื้นที่</span>
                <span className="font-semibold text-white">{informantName || contactName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">เจ้าหน้าที่ผู้ตรวจเยี่ยม</span>
                <span className="font-semibold text-white">{operatorName}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Uploaded Photos Gallery */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-cyan-300">
                  5. รูปภาพที่อัปโหลดจากการตรวจเยี่ยม
                </h4>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                  {photos.length} รูป
                </span>
              </div>

              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAllPhotos}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/50 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 hover:text-white transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>ดาวน์โหลดรูปภาพทั้งหมด</span>
                </button>
              )}
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-md hover:border-cyan-500/50 transition-all duration-200"
                  >
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => setActivePhoto(photo)}
                      className="relative h-44 w-full bg-black/50 overflow-hidden cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={photo.url || photo.dataUrl}
                        alt={photo.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {/* Zoom Indicator Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
                          <ZoomIn className="h-3.5 w-3.5" />
                          <span>ดูรูปขนาดใหญ่</span>
                        </span>
                      </div>
                    </div>

                    {/* Photo Info & Download Button */}
                    <div className="p-2.5 flex items-center justify-between gap-2 bg-slate-950/80">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate" title={photo.name}>
                          {photo.name || `photo_${index + 1}.jpg`}
                        </p>
                        {photo.size ? (
                          <span className="text-[11px] text-slate-500">
                            {formatSize(photo.size)}
                          </span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDownloadPhoto(photo, e)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/60 px-2.5 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-600 hover:text-white transition-all cursor-pointer shrink-0 shadow-sm"
                        title="ดาวน์โหลดรูปภาพนี้"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>ดาวน์โหลด</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
                <ImageIcon className="h-9 w-9 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-400">
                  ไม่มีรูปภาพแนบในบันทึกรายการนี้
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  สามารถอัปโหลดรูปภาพแนบเพิ่มเติมในการบันทึกตรวจเยี่ยมครั้งถัดไป
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Full Resolution Photo */}
      <Dialog
        open={Boolean(activePhoto)}
        onOpenChange={(open) => !open && setActivePhoto(null)}
      >
        <DialogContent className="max-w-3xl bg-slate-950/98 border-blue-500/40 p-4 text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="min-w-0 pr-4">
              <h4 className="text-sm font-bold text-white truncate">
                {activePhoto?.name}
              </h4>
              {activePhoto?.size ? (
                <span className="text-xs text-slate-400">
                  ขนาดไฟล์: {formatSize(activePhoto.size)}
                </span>
              ) : null}
            </div>
            {activePhoto && (
              <button
                type="button"
                onClick={() => handleDownloadPhoto(activePhoto)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer shrink-0"
              >
                <Download className="h-4 w-4" />
                <span>ดาวน์โหลดรูปภาพ</span>
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center rounded-xl bg-black/80 max-h-[75vh] overflow-hidden p-2">
            {activePhoto && (
              <img
                src={activePhoto.url || activePhoto.dataUrl}
                alt={activePhoto.name}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

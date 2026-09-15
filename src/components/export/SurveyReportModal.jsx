import React, { useRef } from 'react';
import { Printer, Download, X, FileText, CheckCircle2, ShieldCheck, Check, AlertTriangle } from 'lucide-react';
import nbtcLogo from '@/assets/images/nbtc-logo-dashboard.png';
import forthLogo from '@/assets/images/forth-logo.png';

/**
 * SurveyReportModal - Pre-PM Survey A4 Printable Report Modal
 * Fully integrated with real recorded survey data.
 * Adheres to official Thai document design standards (TH Sarabun New, A4).
 */
export function SurveyReportModal({ isOpen, onClose, surveyData = {} }) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  // Extract recorded survey fields (supports both flat formData and DB records with fields)
  const fields = surveyData.fields ? { ...surveyData.fields, ...surveyData } : surveyData;

  const stationName = fields.station || fields.village || 'สถานีวิทยุคมนาคม NBTC Microwave';
  const province = fields.province || '';
  const district = fields.district || '';
  const subdistrict = fields.subdistrict || '';
  const installationPlace = fields.installationPlace || fields.installation_place || '-';
  const equipmentPlace = fields.equipmentPlace || fields.equipment_place || '-';

  // Format full location
  const locationParts = [];
  if (fields.installationPlace) locationParts.push(fields.installationPlace);
  if (subdistrict) locationParts.push(`ต.${subdistrict}`);
  if (district) locationParts.push(`อ.${district}`);
  if (province) locationParts.push(`จ.${province}`);
  const locationText = locationParts.length > 0 ? locationParts.join(' ') : (fields.village || '-');

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
      : new Date().toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }));

  const visitTime = fields.visitTime ? `${fields.visitTime} น.` : '-';
  const recordId = fields.recordId || fields.record_id || `PREPM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

  // Contact Info
  const contactName = fields.contactName || fields.contact_name || fields.informantName || '-';
  const contactPosition = fields.contactPosition || fields.contact_position || 'เจ้าของพื้นที่ / ผู้ดูแลสถานี';
  const contactVillage = fields.contactVillage || fields.subdistrict || '-';
  const contactPhone = fields.contactPhone || '-';

  // Permission
  const permit = fields.permit || 'อนุญาต';
  const isPermitted = permit === 'อนุญาต';
  const accessLimit = fields.accessLimit || 'ไม่มีข้อจำกัด';

  // Equipment & Operational Assessment Fields
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

  // Environment & Site Conditions
  const siteCondition = fields.siteCondition || 'สภาพพื้นที่ปกติ พร้อมสำหรับการปฏิบัติงาน';
  const antennaCondition = fields.antennaCondition || 'สภาพเสาและสายอากาศอยู่ในเกณฑ์ปกติ';
  const workObstacle = fields.workObstacle || 'ไม่มีอุปสรรคในการปฏิบัติงาน';

  // Summary & Signatures
  const summary = fields.summary || 'เจ้าของพื้นที่ให้ความร่วมมือในการเข้าตรวจเยี่ยมและตรวจสอบสภาพระบบอุปกรณ์เป็นอย่างดี';
  const informantName = fields.informantName || contactName;
  const operatorName = fields.operatorName || 'วิศวกรผู้ควบคุมงาน';

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto no-print-backdrop">
      {/* Modal Container */}
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-blue-500/30 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Modal Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 py-3.5 no-print">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white leading-tight truncate">
                แบบรายงานการตรวจเยี่ยมเจ้าของพื้นที่ Pre-PM (A4 Official Report)
              </h3>
              <p className="text-xs text-slate-400 truncate">
                สถานี: <span className="text-cyan-300 font-semibold">{stationName}</span> | รหัส: <span className="font-mono text-cyan-400">{recordId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>

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

        {/* Printable A4 Preview Container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-4 md:p-6 bg-slate-950/50 flex justify-start lg:justify-center">
          
          {/* A4 Sheet Paper */}
          <div
            id="printable-report-area"
            ref={printRef}
            className="a4-sheet font-sarabun text-black bg-white shadow-2xl p-6 md:p-7 border border-slate-300 rounded-sm w-[210mm] min-h-[297mm] mx-auto text-[13px] leading-relaxed relative box-border"
            style={{
              fontFamily: "'TH Sarabun New', 'THSarabunNew', 'Sarabun', sans-serif",
              color: '#000000',
              backgroundColor: '#ffffff'
            }}
          >
            {/* 1. Header with Logos & Project Title */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-black mb-2.5">
              {/* Left Logo - NBTC */}
              <div className="w-16 shrink-0 flex items-center justify-start">
                <img
                  src={nbtcLogo}
                  alt="NBTC Logo"
                  className="h-14 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/nbtc-logo-dashboard.png';
                  }}
                />
              </div>

              {/* Center Title - NBTC Microwave Project Title */}
              <div className="flex-1 min-w-0 text-center px-2 py-0.5 space-y-0.5">
                <h1 className="text-[14px] font-bold leading-tight tracking-normal whitespace-nowrap">
                  การจัดซื้ออุปกรณ์พร้อมดำเนินการติดตั้ง
                </h1>
                <h2 className="text-[12.5px] font-bold leading-tight tracking-normal whitespace-nowrap text-neutral-900">
                  โครงการบำรุงรักษาเชิงป้องกันล่วงหน้า (Pre-Preventive Maintenance: Pre-PM)
                </h2>
                <h3 className="text-[12px] font-bold leading-tight tracking-normal whitespace-nowrap text-neutral-800">
                  ระบบศูนย์ควบคุมและบันทึกข้อมูลการตรวจเยี่ยมเจ้าของพื้นที่ สถานีวิทยุคมนาคม NBTC Microwave
                </h3>
              </div>

              {/* Right Logo - FORTH */}
              <div className="w-16 shrink-0 flex items-center justify-end">
                <img
                  src={forthLogo}
                  alt="FORTH Logo"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Document Meta Subheader */}
            <div className="flex justify-between items-center text-[12px] pb-2 text-neutral-800 font-medium">
              <div>
                <span className="font-bold">รหัสรายการสำรวจ: </span>
                <span className="font-mono">{recordId}</span>
              </div>
              <div>
                <span className="font-bold">วันที่บันทึกตรวจเยี่ยม: </span>
                <span>{visitDateStr}</span>
                {visitTime !== '-' && <span className="ml-2">({visitTime})</span>}
              </div>
            </div>

            {/* Section 1: ข้อมูลสถานีและสถานที่ติดตั้ง */}
            <div className="mb-2.5">
              <div className="bg-neutral-100 font-bold border border-black px-2 py-0.5 text-[13px]">
                1. ข้อมูลสถานีและสถานที่ติดตั้ง (Station & Location Details)
              </div>
              <table className="w-full border-collapse border border-t-0 border-black text-[12.5px]">
                <tbody>
                  <tr>
                    <td className="border border-black py-1 px-2.5 w-[20%] font-bold bg-neutral-50/50">
                      ชื่อสถานี
                    </td>
                    <td className="border border-black py-1 px-2.5 w-[30%] font-semibold">
                      {stationName}
                    </td>
                    <td className="border border-black py-1 px-2.5 w-[20%] font-bold bg-neutral-50/50">
                      สถานที่วางเครื่อง
                    </td>
                    <td className="border border-black py-1 px-2.5 w-[30%]">
                      {equipmentPlace}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-1 px-2.5 font-bold bg-neutral-50/50">
                      สถานที่ติดตั้ง
                    </td>
                    <td className="border border-black py-1 px-2.5" colSpan={3}>
                      {locationText}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: ข้อมูลเจ้าของพื้นที่และการขออนุญาต */}
            <div className="mb-2.5">
              <div className="bg-neutral-100 font-bold border border-black px-2 py-0.5 text-[13px]">
                2. ข้อมูลผู้ให้ข้อมูล / เจ้าของพื้นที่ และการขออนุญาตเข้าพื้นที่ (Site Owner & Access Permission)
              </div>
              <table className="w-full border-collapse border border-t-0 border-black text-[12.5px]">
                <tbody>
                  <tr>
                    <td className="border border-black py-1 px-2.5 w-[20%] font-bold bg-neutral-50/50">
                      ชื่อ - สกุล
                    </td>
                    <td className="border border-black py-1 px-2.5 w-[30%] font-semibold">
                      {contactName}
                    </td>
                    <td className="border border-black py-1 px-2.5 w-[20%] font-bold bg-neutral-50/50">
                      ตำแหน่ง
                    </td>
                    <td className="border border-black py-1 px-2.5 w-[30%]">
                      {contactPosition}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-1 px-2.5 font-bold bg-neutral-50/50">
                      หน่วยงาน / หมู่บ้าน
                    </td>
                    <td className="border border-black py-1 px-2.5">
                      {contactVillage}
                    </td>
                    <td className="border border-black py-1 px-2.5 font-bold bg-neutral-50/50">
                      เบอร์โทรศัพท์
                    </td>
                    <td className="border border-black py-1 px-2.5 font-mono">
                      {contactPhone}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-1 px-2.5 font-bold bg-neutral-50/50">
                      ผลการขออนุญาต
                    </td>
                    <td className="border border-black py-1 px-2.5">
                      <span className={`inline-block font-bold px-2 py-0.2 rounded ${
                        isPermitted ? 'bg-emerald-100 text-emerald-900 border border-emerald-400' : 'bg-rose-100 text-rose-900 border border-rose-400'
                      }`}>
                        {isPermitted ? '✓ อนุญาตให้เข้าพื้นที่' : '✗ ไม่อนุญาตให้เข้าพื้นที่'}
                      </span>
                    </td>
                    <td className="border border-black py-1 px-2.5 font-bold bg-neutral-50/50">
                      ข้อจำกัดในการเข้าพื้นที่
                    </td>
                    <td className="border border-black py-1 px-2.5">
                      {accessLimit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: ผลการตรวจสอบและประเมินสภาพระบบอุปกรณ์ */}
            <div className="mb-2.5">
              <div className="bg-neutral-100 font-bold border border-black px-2 py-0.5 text-[13px]">
                3. บันทึกผลการตรวจสอบและประเมินสภาพระบบอุปกรณ์ (Equipment & Operational Assessment)
              </div>
              <table className="w-full border-collapse border border-t-0 border-black text-[12.5px]">
                <thead>
                  <tr className="bg-neutral-50 font-bold border-b border-black text-center">
                    <th className="border border-black py-1 px-2 w-[8%]">ลำดับ</th>
                    <th className="border border-black py-1 px-3 text-left w-[42%]">รายการตรวจประเมิน</th>
                    <th className="border border-black py-1 px-2 w-[22%]">ผลการตรวจ</th>
                    <th className="border border-black py-1 px-3 text-left w-[28%]">รายละเอียด / ข้อสังเกต</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Item 1 */}
                  <tr>
                    <td className="border border-black py-1 px-2 text-center">1</td>
                    <td className="border border-black py-1 px-3">
                      สภาพการทำงานของเครื่องวิทยุคมนาคม
                    </td>
                    <td className="border border-black py-1 px-2 text-center font-semibold">
                      {isRadioNormal ? (
                        <span className="text-emerald-800 font-bold">✓ ปกติ</span>
                      ) : (
                        <span className="text-rose-700 font-bold">✗ ไม่ปกติ ({radioStatus})</span>
                      )}
                    </td>
                    <td className="border border-black py-1 px-3 text-neutral-700">
                      {isRadioNormal ? 'เครื่องวิทยุทำงานปกติ' : 'พบข้อขัดข้องในการใช้งาน'}
                    </td>
                  </tr>

                  {/* Item 2 */}
                  <tr>
                    <td className="border border-black py-1 px-2 text-center">2</td>
                    <td className="border border-black py-1 px-3">
                      ภาครับสัญญาณ (Receiver Status)
                    </td>
                    <td className="border border-black py-1 px-2 text-center font-semibold">
                      {isReceiveNormal ? (
                        <span className="text-emerald-800 font-bold">✓ ไม่พบปัญหา</span>
                      ) : (
                        <span className="text-rose-700 font-bold">✗ พบปัญหา ({receiveStatus})</span>
                      )}
                    </td>
                    <td className="border border-black py-1 px-3 text-neutral-700">
                      {isReceiveNormal ? 'รับสัญญาณได้ชัดเจน' : 'สัญญาณขาดหาย/มีสัญญาณรบกวน'}
                    </td>
                  </tr>

                  {/* Item 3 */}
                  <tr>
                    <td className="border border-black py-1 px-2 text-center">3</td>
                    <td className="border border-black py-1 px-3">
                      ภาคส่งสัญญาณ (Transmitter Status)
                    </td>
                    <td className="border border-black py-1 px-2 text-center font-semibold">
                      {isTransmitNormal ? (
                        <span className="text-emerald-800 font-bold">✓ ไม่พบปัญหา</span>
                      ) : (
                        <span className="text-rose-700 font-bold">✗ พบปัญหา ({transmitStatus})</span>
                      )}
                    </td>
                    <td className="border border-black py-1 px-3 text-neutral-700">
                      {isTransmitNormal ? 'ส่งสัญญาณออกอากาศได้ตามปกติ' : 'กำลังส่งตก/ส่งสัญญาณไม่ได้'}
                    </td>
                  </tr>

                  {/* Item 4 */}
                  <tr>
                    <td className="border border-black py-1 px-2 text-center">4</td>
                    <td className="border border-black py-1 px-3">
                      ระบบไฟฟ้าหลักของสถานี (Power Supply)
                    </td>
                    <td className="border border-black py-1 px-2 text-center font-semibold">
                      {isPowerNormal ? (
                        <span className="text-emerald-800 font-bold">✓ ไม่มีปัญหา</span>
                      ) : (
                        <span className="text-rose-700 font-bold">✗ มีปัญหา ({powerStatus})</span>
                      )}
                    </td>
                    <td className="border border-black py-1 px-3 text-neutral-700">
                      {isPowerNormal ? 'ระบบไฟฟ้าจ่ายไฟสม่ำเสมอ' : 'ระบบไฟฟ้าขัดข้อง/ไฟตกบ่อย'}
                    </td>
                  </tr>

                  {/* Item 5 */}
                  <tr>
                    <td className="border border-black py-1 px-2 text-center">5</td>
                    <td className="border border-black py-1 px-3">
                      แบตเตอรี่สำรอง (Backup Battery)
                    </td>
                    <td className="border border-black py-1 px-2 text-center font-semibold">
                      {isBatteryNormal ? (
                        <span className="text-emerald-800 font-bold">✓ ไม่มีปัญหา</span>
                      ) : (
                        <span className="text-rose-700 font-bold">✗ มีปัญหา ({batteryStatus})</span>
                      )}
                    </td>
                    <td className="border border-black py-1 px-3 text-neutral-700">
                      {isBatteryNormal ? 'แบตเตอรี่สำรองพร้อมจ่ายไฟ' : 'แบตเตอรี่เสื่อม/เก็บไฟไม่อยู่'}
                    </td>
                  </tr>

                  {/* Additional Problems */}
                  <tr>
                    <td className="border border-black py-1 px-2 text-center font-bold bg-neutral-50/50" colSpan={2}>
                      ปัญหาเพิ่มเติมที่ผู้ใช้งานแจ้ง
                    </td>
                    <td className="border border-black py-1 px-3 text-neutral-800" colSpan={2}>
                      {userProblem}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 4: สภาพแวดล้อมหน้างานและสิ่งกีดขวาง */}
            <div className="mb-2.5">
              <div className="bg-neutral-100 font-bold border border-black px-2 py-0.5 text-[13px]">
                4. สภาพแวดล้อมหน้างานและอาคารสถานที่ (Site Environmental & Physical Conditions)
              </div>
              <table className="w-full border-collapse border border-t-0 border-black text-[12.5px]">
                <tbody>
                  <tr>
                    <td className="border border-black py-1 px-2.5 w-[35%] font-bold bg-neutral-50/50">
                      สภาพพื้นที่ติดตั้งอุปกรณ์
                    </td>
                    <td className="border border-black py-1 px-2.5 w-[65%]">
                      {siteCondition}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-1 px-2.5 font-bold bg-neutral-50/50">
                      สภาพเสาอากาศและสายอากาศ (มองเห็นจากพื้น)
                    </td>
                    <td className="border border-black py-1 px-2.5">
                      {antennaCondition}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-1 px-2.5 font-bold bg-neutral-50/50">
                      อุปสรรคและข้อจำกัดในการปฏิบัติงาน
                    </td>
                    <td className="border border-black py-1 px-2.5">
                      {workObstacle}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 5: สรุปผลการตรวจเยี่ยม */}
            <div>
              <div className="bg-neutral-100 font-bold border border-black px-2 py-0.5 text-[13px]">
                5. สรุปผลการตรวจเยี่ยมและข้อคิดเห็น (Survey Summary & Recommendations)
              </div>
              <div className="border border-t-0 border-black p-2.5 text-[12.5px] leading-relaxed min-h-[48px] bg-white">
                {summary}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

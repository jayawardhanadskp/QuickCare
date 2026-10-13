import { jsPDF } from 'jspdf'

// Make a simple PDF receipt for an appointment and download it
export function downloadReceipt(a) {
  const pdf = new jsPDF()
  const line = (label, value, y) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(label, 20, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(String(value), 75, y)
  }

  pdf.setFontSize(22)
  pdf.setTextColor(15, 118, 110)
  pdf.text('QuickCare', 20, 25)
  pdf.setFontSize(12)
  pdf.setTextColor(80)
  pdf.text('Appointment Receipt', 20, 33)
  pdf.line(20, 38, 190, 38)

  pdf.setTextColor(0)
  line('Receipt no:', a._id.slice(-8).toUpperCase(), 50)
  line('Patient:', a.patient.name, 60)
  line('Doctor:', a.doctor.name, 70)
  line('Specialization:', a.specialization, 80)
  line('Date:', a.date, 90)
  line('Time:', a.time, 100)
  line('Status:', a.status, 110)
  line('Consultation fee:', `LKR ${a.fee}`, 120)

  pdf.setFontSize(10)
  pdf.setTextColor(120)
  pdf.text('The fee is paid at the clinic. Thank you for choosing QuickCare.', 20, 140)
  pdf.save(`receipt-${a._id.slice(-8)}.pdf`)
}

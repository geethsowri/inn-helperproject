import { Component, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
declare var QRCode: any;

@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.component.html',
  imports: [MatButtonModule, CommonModule],
  styleUrls: ['./id-card.component.scss'],
  standalone: true,
})
export class IdCardComponent implements AfterViewInit {
  @ViewChild('idCard', { static: false }) idCard!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngAfterViewInit(): void {
    this.generateQrCodes();
  }

  private generateQrCodes() {
    // QR Code for attendance
    new QRCode(document.getElementById('QrCodePlaceHolder'), {
      text: `${this.data.apiBaseUrl}api/helpers/${this.data.emp_id}/attendance`,
      width: 80,
      height: 80
    });

    // QR Code for verification
    new QRCode(document.getElementById('QrCode2PlaceHolder'), {
      text: `${this.data.apiBaseUrl}api/helpers/${this.data.emp_id}/id-card/verify`,
      width: 80,
      height: 80
    });
  }

  async download() {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const card = this.idCard.nativeElement;
      const canvas = await html2canvas(card, { backgroundColor: '#ffffff', scale: 2, useCORS: true, allowTaint: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${this.data.fullName}_ID_Card.pdf`);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }

  print() {
    const card = this.idCard.nativeElement;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try { return Array.from(sheet.cssRules).map(r => r.cssText).join(''); }
        catch { return ''; }
      })
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Employee ID Card - ${this.data.fullName}</title>
          <style>${styles} @media print { body{margin:0;padding:20px;} }</style>
        </head>
        <body>${card.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }
}

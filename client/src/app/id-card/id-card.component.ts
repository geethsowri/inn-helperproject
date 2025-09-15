import { Component, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import QRCode from 'qrcode';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.component.html',
  imports: [MatButtonModule, CommonModule],
  styleUrls: ['./id-card.component.scss'],
  standalone: true,
})
export class IdCardComponent implements AfterViewInit {
  @ViewChild('frontCard', { static: false }) frontCard!: ElementRef;
  @ViewChild('backCard', { static: false }) backCard!: ElementRef;

  qrCodeUrl: string | null = null;
  
  // Track which card side is active
  activeCard: 'front' | 'back' = 'front';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // Generate QR code with emp_id or encoded JSON
    QRCode.toDataURL(JSON.stringify({ emp_id: data.emp_id, phone: data.phone }))
      .then(url => this.qrCodeUrl = url)
      .catch(err => console.error('QR Code generation failed:', err));
  }

  ngAfterViewInit(): void {
    // Initialize card controls after view is ready
    this.initializeCardControls();
  }

  private initializeCardControls(): void {
    // Set initial card position
    this.showFrontCard();
  }

  // Method to show front card (called by template)
  showFrontCard(): void {
    this.activeCard = 'front';
    if (this.frontCard && this.backCard) {
      this.frontCard.nativeElement.style.transform = 'rotateY(0deg)';
      this.backCard.nativeElement.style.transform = 'rotateY(90deg)';
    }
  }

  // Method to show back card (called by template)
  showBackCard(): void {
    this.activeCard = 'back';
    if (this.frontCard && this.backCard) {
      this.frontCard.nativeElement.style.transform = 'rotateY(-90deg)';
      this.backCard.nativeElement.style.transform = 'rotateY(0deg)';
    }
  }

  // Check if front card is active
  isFrontActive(): boolean {
    return this.activeCard === 'front';
  }

  // Check if back card is active
  isBackActive(): boolean {
    return this.activeCard === 'back';
  }

  async download() {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');
      
      const card = document.getElementById('idCard')!;
      
      // Temporarily show both cards for capture
      const frontCard = this.frontCard.nativeElement;
      const backCard = this.backCard.nativeElement;
      
      // Save current transforms
      const frontTransform = frontCard.style.transform;
      const backTransform = backCard.style.transform;
      
      // Reset transforms for capture
      frontCard.style.transform = 'rotateY(0deg)';
      backCard.style.transform = 'rotateY(0deg)';
      
      const canvas = await html2canvas(card, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      });
      
      // Restore original transforms
      frontCard.style.transform = frontTransform;
      backCard.style.transform = backTransform;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit properly
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${this.data.fullName}_ID_Card.pdf`);
      
    } catch (error) {
      console.error('Download failed:', error);
      // You might want to show a user-friendly error message here
    }
  }

  print() {
    try {
      const card = document.getElementById('idCard')!;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        // Include the styles in the print window
        const styles = Array.from(document.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('');
            } catch (e) {
              console.log('Access denied for stylesheet', styleSheet.href);
              return '';
            }
          })
          .join('');

        printWindow.document.write(`
          <html>
            <head>
              <title>Employee ID Card - ${this.data.fullName}</title>
              <style>
                ${styles}
                @media print {
                  body { margin: 0; padding: 20px; }
                  .action-panel { display: none !important; }
                  .section-header { margin-bottom: 20px; }
                  .card { 
                    box-shadow: none !important; 
                    border: 1px solid #e2e8f0 !important;
                    transform: none !important;
                  }
                }
              </style>
            </head>
            <body>
              ${card.outerHTML}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        
        // Wait for images to load before printing
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    } catch (error) {
      console.error('Print failed:', error);
      // Fallback to browser's print dialog
      window.print();
    }
  }

  delete() {
    // Enhanced delete logic
    console.log('Delete clicked for employee:', this.data.fullName);
    
    // You can emit an event to parent component or implement delete logic here
    // Example: this.dialogRef.close({ action: 'delete', data: this.data });
    
    // Or show confirmation dialog
    if (confirm(`Are you sure you want to delete the ID card for ${this.data.fullName}?`)) {
      // Implement actual delete logic
      console.log('ID Card deleted');
    }
  }

  // Utility method to get full employee data with fallbacks
  getEmployeeData() {
    return {
      fullName: this.data.fullName || 'Employee Name',
      role: this.data.role || 'Position',
      emp_id: this.data.emp_id || '000000',
      organization: this.data.organization || 'Organization',
      phone: this.data.phone || 'N/A',
      joinDate: this.data.joinDate || 'N/A',
      department: this.data.department || 'General',
      profile: this.data.profile || null
    };
  }
}
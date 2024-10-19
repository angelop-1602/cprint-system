declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | string;
        filename?: string;
        html2canvas?: {
            scale?: number;
            width?: number;
            height?: number;
            windowWidth?: number;
            windowHeight?: number;
        };
        jsPDF?: {
            unit?: string;
            format?: string;
            orientation?: string;
        };
    }

    interface Html2Pdf {
        from(element: HTMLElement): {
            set(options: Html2PdfOptions): this;
            outputPdf(): Promise<Blob>; // Ensure outputPdf is defined here
        };
    }

    function html2pdf(): Html2Pdf;

    export default html2pdf;
}

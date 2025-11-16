import { 
  Controller, 
  Post, 
  Get, 
  Delete,
  Param,
  UploadedFile, 
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfImportService } from './pdf-import.service';

@Controller('pdf-import')
export class PdfImportController {
  constructor(private readonly pdfImportService: PdfImportService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLiquorDeliveryPDF(
    @UploadedFile() file: any,
  ): Promise<any> {
    try {
      console.log('Received file upload request:', {
        filename: file?.originalname,
        mimetype: file?.mimetype,
        size: file?.size
      });

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed');
      }

      if (file.size === 0) {
        throw new BadRequestException('Empty file uploaded');
      }

      const result = await this.pdfImportService.processLiquorDeliveryPDF(file);
      
      console.log('Upload processing completed:', result);
      return result;
      
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  @Get('deliveries')
  async getAllDeliveries() {
    try {
      const deliveries = await this.pdfImportService.findAll();
      return {
        status: 'success',
        count: deliveries.length,
        data: deliveries
      };
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      throw error;
    }
  }

  @Get('deliveries/:id')
  async getDeliveryById(@Param('id') id: string) {
    try {
      const delivery = await this.pdfImportService.findById(+id);
      return {
        status: 'success',
        data: delivery
      };
    } catch (error) {
      console.error('Error fetching delivery:', error);
      throw error;
    }
  }

  @Delete('deliveries/:id')
  async deleteDelivery(@Param('id') id: string) {
    try {
      await this.pdfImportService.deleteById(+id);
      return {
        status: 'success',
        message: `Delivery record ${id} deleted successfully`
      };
    } catch (error) {
      console.error('Error deleting delivery:', error);
      throw error;
    }
  }

  @Get('history')
  async getImportHistory() {
    try {
      const history = await this.pdfImportService.getImportHistory();
      return {
        status: 'success',
        count: history.length,
        data: history
      };
    } catch (error) {
      console.error('Error fetching import history:', error);
      throw error;
    }
  }

  @Get('history/:id')
  async getImportHistoryById(@Param('id') id: string) {
    try {
      const history = await this.pdfImportService.getImportHistoryById(+id);
      return {
        status: 'success',
        data: history
      };
    } catch (error) {
      console.error('Error fetching import history:', error);
      throw error;
    }
  }
}
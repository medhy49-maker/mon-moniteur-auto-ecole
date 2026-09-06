import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un nouvel étudiant' })
  @ApiResponse({
    status: 201,
    description: 'Étudiant créé avec succès',
  })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les étudiants' })
  @ApiResponse({
    status: 200,
    description: 'Liste des étudiants',
  })
  findAll() {
    return this.studentService.findAll();
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Obtenir un étudiant par email' })
  @ApiParam({ name: 'email', type: 'string' })
  findByEmail(@Param('email') email: string) {
    return this.studentService.findByEmail(email);
  }

  @Get('level/:level')
  @ApiOperation({ summary: 'Obtenir les étudiants par niveau' })
  @ApiParam({ name: 'level', type: 'string' })
  findByLevel(@Param('level') level: string) {
    return this.studentService.findByLevel(level);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtenir les étudiants par statut' })
  @ApiParam({ name: 'status', type: 'string' })
  findByStatus(@Param('status') status: string) {
    return this.studentService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un étudiant par ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Étudiant trouvé',
  })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un étudiant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Étudiant mis à jour',
  })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Patch(':id/increment-hours')
  @ApiOperation({ summary: 'Incrémenter les heures complétées' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'hours', type: 'number', example: 2 })
  incrementHours(@Param('id') id: string, @Query('hours') hours: string) {
    return this.studentService.incrementHours(id, parseInt(hours, 10));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer un étudiant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Étudiant supprimé' })
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}

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
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer une nouvelle leçon' })
  @ApiResponse({
    status: 201,
    description: 'Leçon créée avec succès',
  })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les leçons' })
  @ApiResponse({
    status: 200,
    description: 'Liste des leçons',
  })
  findAll() {
    return this.lessonService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Obtenir les leçons d\'un étudiant' })
  @ApiParam({ name: 'studentId', type: 'string', format: 'uuid' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.lessonService.findByStudent(studentId);
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Obtenir les leçons d\'un instructeur' })
  @ApiParam({ name: 'instructorId', type: 'string', format: 'uuid' })
  findByInstructor(@Param('instructorId') instructorId: string) {
    return this.lessonService.findByInstructor(instructorId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtenir les leçons par statut' })
  @ApiParam({ name: 'status', type: 'string' })
  findByStatus(@Param('status') status: string) {
    return this.lessonService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une leçon par ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Leçon trouvée',
  })
  @ApiResponse({ status: 404, description: 'Leçon non trouvée' })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une leçon' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Leçon mise à jour',
  })
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.update(id, updateLessonDto);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Démarrer une leçon' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  startLesson(@Param('id') id: string) {
    return this.lessonService.startLesson(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Terminer une leçon' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'rating', type: 'number', required: false })
  @ApiQuery({ name: 'feedback', type: 'string', required: false })
  completeLesson(
    @Param('id') id: string,
    @Query('rating') rating?: string,
    @Query('feedback') feedback?: string,
  ) {
    return this.lessonService.completeLesson(
      id,
      rating ? parseInt(rating, 10) : undefined,
      feedback,
    );
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Annuler une leçon' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  cancelLesson(@Param('id') id: string) {
    return this.lessonService.cancelLesson(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer une leçon' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Leçon supprimée' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}

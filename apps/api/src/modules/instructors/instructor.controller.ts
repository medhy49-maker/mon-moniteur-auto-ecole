import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './instructor.entity';

@ApiTags('Instructors')
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un nouvel instructeur' })
  @ApiResponse({
    status: 201,
    description: 'Instructeur créé avec succès',
    type: Instructor,
  })
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les instructeurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des instructeurs',
    type: [Instructor],
  })
  findAll() {
    return this.instructorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un instructeur par ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Instructeur trouvé',
    type: Instructor,
  })
  @ApiResponse({ status: 404, description: 'Instructeur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.instructorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un instructeur' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Instructeur mis à jour',
    type: Instructor,
  })
  update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return this.instructorService.update(id, updateInstructorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer un instructeur' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Instructeur supprimé' })
  remove(@Param('id') id: string) {
    return this.instructorService.remove(id);
  }
}

/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" is not found`);
    }

    return found;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" is not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.save(task);

    return task;
  }

  async getTasks({ status, search }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER():search) OR LOWER(task.description) LIKE LOWER():search)',
        { search: `%${search}%` },
      );
    }

    const tasks = query.getMany();

    return tasks;
  }
}

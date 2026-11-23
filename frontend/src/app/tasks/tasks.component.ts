import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  tasks: Task[] = [];
  newTitle = '';
  editingId: string | null = null;
  editedTitle = '';
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les tâches. Vérifiez que le backend est démarré.';
        this.loading = false;
      },
    });
  }

  addTask(): void {
    const title = this.newTitle.trim();
    if (!title) return;

    this.taskService.addTask(title).subscribe({
      next: (task) => {
        this.tasks = [task, ...this.tasks];
        this.newTitle = '';
        this.error = '';
      },
      error: () => (this.error = "Impossible d'ajouter la tâche."),
    });
  }

  startEdit(task: Task): void {
    this.editingId = task._id;
    this.editedTitle = task.title;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(task: Task): void {
    const title = this.editedTitle.trim();
    if (!title) return;

    this.taskService.updateTask(task._id, { title }).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map((item) => (item._id === updated._id ? updated : item));
        this.editingId = null;
      },
      error: () => (this.error = 'Impossible de modifier la tâche.'),
    });
  }

  toggleCompleted(task: Task): void {
    this.taskService.updateTask(task._id, { completed: !task.completed }).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map((item) => (item._id === updated._id ? updated : item));
      },
      error: () => (this.error = 'Impossible de mettre à jour la tâche.'),
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task._id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((item) => item._id !== task._id);
      },
      error: () => (this.error = 'Impossible de supprimer la tâche.'),
    });
  }
}

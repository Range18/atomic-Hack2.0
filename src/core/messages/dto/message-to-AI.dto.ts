export type Roles = 'user' | 'assistant';

export class MessageToAIDto {
  role: Roles;

  content: string;

  constructor(role: Roles, content: string) {
    this.role = role;
    this.content = content;
  }
}

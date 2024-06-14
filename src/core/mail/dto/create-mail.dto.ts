export class CreateMailDto {
  readonly authorId: string;

  readonly name: string;

  readonly email: string;

  readonly text: string;

  readonly filesNames?: string[];
}

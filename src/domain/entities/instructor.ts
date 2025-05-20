import { Entity } from "../../core/entity"
import { UniqueEntityID } from "../../core/unique-entity-id"

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityID) {
    const instructor = new Instructor(props, id)

    return instructor
  }
}
import { Entity } from '@/core/entity'
import { UniqueEntityID } from '@/core/unique-entity-id'

interface StudentProps {
  name: string
}
export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id)

    return student
  }
}

import { UniqueEntityID } from '@/core/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase // system under test - sut

describe('Edit answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toString(),
      content: 'Conteúdo test',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conteúdo test',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    inMemoryAnswersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        answerId: 'answer-1',
        authorId: 'author-2',
        content: 'Conteúdo test',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})

import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answers'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase // system under test - sut

describe('Fetch question answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await Promise.all(
      Array.from({ length: 3 }, () =>
        inMemoryAnswersRepository.create(
          makeAnswer({ questionId: new UniqueEntityID('question-1') }),
        ),
      ),
    )
    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    await Promise.all(
      Array.from({ length: 22 }, () =>
        inMemoryAnswersRepository.create(
          makeAnswer({ questionId: new UniqueEntityID('question-1') }),
        ),
      ),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})

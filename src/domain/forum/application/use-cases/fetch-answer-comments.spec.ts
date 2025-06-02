import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

import { UniqueEntityID } from '@/core/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase // system under test - sut

describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await Promise.all(
      Array.from({ length: 3 }, () =>
        inMemoryAnswerCommentsRepository.create(
          makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
        ),
      ),
    )
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    await Promise.all(
      Array.from({ length: 22 }, () =>
        inMemoryAnswerCommentsRepository.create(
          makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
        ),
      ),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})

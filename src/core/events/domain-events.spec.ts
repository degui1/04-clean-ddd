import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvent } from './domain-event'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('DomainEvents', () => {
  it('should be able to dispatch and listen to events', () => {
    const spy = vi.fn()

    DomainEvents.register(spy, CustomAggregateCreated.name)

    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(spy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})

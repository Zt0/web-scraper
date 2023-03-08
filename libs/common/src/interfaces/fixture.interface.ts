export interface IFixtureCreator<TEntity> {
  /**
   * static objects for creating data
   */
  dataToCreate: Partial<TEntity>[]

  /**
   * objects identifiers for removing data
   */
  dataToRemove: Partial<TEntity>[]

  /**
   * Create data with static objects
   */
  createFixtures(): Promise<void>

  /**
   * Remove data by static object identifiers
   */

  destroyFixtures(): Promise<void>

  /**
   * Remove data by id
   */
  removeByIds(ids: number[]): Promise<void>
}

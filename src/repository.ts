// A box with a label: one repository for any type that has an id (generics).
// The data is private: outside code can only use add / getAll / findById.
export class Repository<T extends { id: string }> {
  private items: T[];

  constructor(items: T[] = []) {
    this.items = [...items];
  }

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items]; // a copy, so nobody can change the original list
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

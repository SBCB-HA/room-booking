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
  remove(id: string): boolean {
    const kept = [];
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id !== id) {
        kept.push(this.items[i]);
      }

    }
    const isDeleted = kept.length < this.items.length;
    this.items = kept;
    return isDeleted;
  }
  update(id: string, change: Partial<T>): T {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        Object.assign(this.items[i], change);
        return this.items[i];
      }
    }
    throw new Error("Not found: " + id);
  }
}


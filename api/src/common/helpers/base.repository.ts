import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async create(dto: unknown): Promise<T> {
    const newEntity = new this.entityModel(dto);
    return newEntity.save();
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T | null> {
    return this.entityModel.findOne(filterQuery);
  }

  async findById(id: string): Promise<T | null> {
    return this.entityModel.findById(id);
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.entityModel.find(filterQuery);
  }

  async findAll(): Promise<T[]> {
    return this.entityModel.find();
  }

  async update(id: string, updateDto: UpdateQuery<T>): Promise<T | null> {
    return this.entityModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return this.entityModel.findByIdAndDelete(id);
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const result = await this.entityModel.deleteMany(filterQuery);
    return result.deletedCount > 0;
  }

  async count(filterQuery: FilterQuery<T>): Promise<number> {
    return this.entityModel.countDocuments(filterQuery);
  }
}

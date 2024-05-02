import axios from 'axios';
import { fetchUsers, transformUsersData } from './index';

jest.mock('axios'); // Mock axios for testing

describe('fetchUsers', () => {
  it('fetches users successfully', async () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        age: 30,
        gender: 'female',
        hair: { color: 'Blond', type: 'Straight' },
        department: 'IT',
        address: { address: '123 Street', city: 'City', postalCode: '12345' },
      },
    ];
    const response = { data: { users: mockUsers } };
    (axios.get as jest.Mock).mockResolvedValue(response);

    const users = await fetchUsers();
    expect(users).toEqual(mockUsers);
  });

  it('handles error when fetching users', async () => {
    const errorMessage = 'Failed to fetch users';
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchUsers()).rejects.toThrow(errorMessage);
  });
});

describe('transformUsersData', () => {
  it('transforms users data correctly', () => {
    const users = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        age: 30,
        gender: 'female',
        hair: { color: 'Blond', type: 'Straight' },
        department: 'IT',
        address: { address: '123 Street', city: 'City', postalCode: '12345' },
      },
    ];
    const transformedData = transformUsersData(users);

    expect(transformedData).toHaveProperty('IT');
    expect(transformedData['IT'].male).toBe(0);
    expect(transformedData['IT'].female).toBe(1);
    expect(transformedData['IT'].ageRange).toBe('30-30');
    expect(transformedData['IT'].hair).toEqual({
      Black: 0,
      Blond: 1,
      Chestnut: 0,
      Brown: 0,
      Other: 0,
    });
    expect(transformedData['IT'].addressUser).toEqual({
      'AliceSmith': '12345',
    });
  });
});

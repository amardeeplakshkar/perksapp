import { toast } from 'react-toastify';

export const TASKS = {
  TON_PROMOTE: {
    id: 'ton-promote',
    points: 100000,
    requiredAmount: 0.5,
    destinationAddress: 'UQCFxWYZpOuoBmVq1eL3kEvR8q2IAN2oEpTYjM89xlZ6YB1Z'
  }
};

export const verifyTonTransaction = async (txHash: string, userId: string) => {
  try {
    const response = await fetch('/api/verify-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        txHash,
        userId,
        tonAmount: TASKS.TON_PROMOTE.requiredAmount
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify transaction');
    }

    return data;
  } catch (error) {
    console.error('Transaction verification error:', error);
    throw error;
  }
};

export const completeTask = async (userId: string, taskId: string, points: number) => {
  try {
    const response = await fetch('/api/complete-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, taskId, points })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to complete task');
    }

    return data;
  } catch (error) {
    console.error('Task completion error:', error);
    throw error;
  }
};
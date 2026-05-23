import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserBranch = {
  id: string;
  name: string;
};

type BranchState = {
  activeBranchId: string | null;
  activeBranchName: string | null;
  branches: UserBranch[];
  setActiveBranch: (branch: UserBranch) => void;
  clearActiveBranch: () => void;
};

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      activeBranchId: null,
      activeBranchName: null,
      branches: [],
      
      setActiveBranch: (branch: UserBranch) => {
        set({
          activeBranchId: branch.id,
          activeBranchName: branch.name,
        });
      },
      
      clearActiveBranch: () => {
        set({
          activeBranchId: null,
          activeBranchName: null,
        });
      },
    }),
    {
      name: 'tortillaplus-branch',
    }
  )
);

// Activity tracking for BizAIra dashboard stats
// Tracks first use date, creations count, and downloads count

const STORAGE_KEYS = {
  firstUseDate: "bizaira_first_credit_use",
  creationsCount: "bizaira_creations_count",
  downloadsCount: "bizaira_downloads_count",
};

/**
 * Records a new creation action and updates first use date if needed
 */
export function trackCreation(): void {
  // Set first use date if not already set
  if (!localStorage.getItem(STORAGE_KEYS.firstUseDate)) {
    localStorage.setItem(STORAGE_KEYS.firstUseDate, new Date().toISOString());
  }
  
  // Increment creations count
  const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.creationsCount) || "0", 10);
  localStorage.setItem(STORAGE_KEYS.creationsCount, String(currentCount + 1));
}

/**
 * Records a new download action
 */
export function trackDownload(): void {
  // Set first use date if not already set (in case download happens without creation)
  if (!localStorage.getItem(STORAGE_KEYS.firstUseDate)) {
    localStorage.setItem(STORAGE_KEYS.firstUseDate, new Date().toISOString());
  }
  
  // Increment downloads count
  const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.downloadsCount) || "0", 10);
  localStorage.setItem(STORAGE_KEYS.downloadsCount, String(currentCount + 1));
}

/**
 * Gets the current activity stats
 */
export function getActivityStats(): {
  firstUseDate: string | null;
  creationsCount: number;
  downloadsCount: number;
  nextRenewalDate: Date | null;
} {
  const firstUseDate = localStorage.getItem(STORAGE_KEYS.firstUseDate);
  const creationsCount = parseInt(localStorage.getItem(STORAGE_KEYS.creationsCount) || "0", 10);
  const downloadsCount = parseInt(localStorage.getItem(STORAGE_KEYS.downloadsCount) || "0", 10);
  
  let nextRenewalDate: Date | null = null;
  if (firstUseDate) {
    const first = new Date(firstUseDate);
    nextRenewalDate = new Date(first);
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
  }
  
  return {
    firstUseDate,
    creationsCount,
    downloadsCount,
    nextRenewalDate,
  };
}

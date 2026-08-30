/** Pure helpers used by the React session orchestrator and its tests. */

export const createRetryActivity = (activity, retrySequence) => ({
  ...activity,
  id: `${activity.activity_id}__retry__${retrySequence}`,
  retryOf: activity.activity_id,
  retrySequence
});

export const getNextSessionTransition = ({ currentIndex, queueLength, retryActivity = null }) => {
  if (retryActivity) {
    return {
      appendRetry: true,
      nextIndex: currentIndex + 1,
      nextStatus: "active"
    };
  }

  if (currentIndex < queueLength - 1) {
    return {
      appendRetry: false,
      nextIndex: currentIndex + 1,
      nextStatus: "active"
    };
  }

  return {
    appendRetry: false,
    nextIndex: currentIndex,
    nextStatus: "completed"
  };
};

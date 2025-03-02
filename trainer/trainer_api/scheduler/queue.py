# Queue abstract class
# implementation details from
# https://github.com/jazelly/collections-jdk/blob/main/src/PriorityQueue.ts

from typing import Generic, List, Optional, Union, TypeVar, Callable


# Type definitions
T = TypeVar("T")


class QueueNode(Generic[T]):
    def __init__(self, v: T | None):
        self.value = v
        self.next = None
        self.prev = None


class MQueue(Generic[T]):
    def __init__(self):
        # dummy head
        self.head = QueueNode[T](None)
        # substantial tail
        self.tail = self.head
        self.length = 0

    def peek(self) -> T:
        return self.head.next

    def add(self, val: T):
        new_node = QueueNode[T](val)

        self.tail.next = new_node
        new_node.prev = self.tail
        self.tail = new_node
        self.length += 1

        return 0

    def pop(self) -> T | None:
        cur_next = self.head.next
        if cur_next is None:
            return None

        cur_next_next = cur_next.next
        self.head.next = cur_next_next
        if cur_next_next is not None:
            cur_next_next.prev = self.head

        if self.tail == cur_next:
            self.tail = self.head
        cur_next.prev = None
        cur_next.next = None

        self.length -= 1
        return cur_next.value

    def __str__(self):
        result = ""
        cur = self.head
        index = 0
        while cur is not None:
            result += f"Task: {index} "
            if cur.next is not None:
                result += "-> "
            cur = cur.next
            index += 1
        return result


Comparator = Callable[[T, T], int]
Comparable = Union[int, float, str]


class PriorityQueueParams:
    def __init__(
        self,
        from_: Optional[List[T]] = None,
        comparator: Optional[Comparator[T]] = None,
    ):
        self.from_ = from_
        self.comparator = comparator


class PriorityQueue:
    def __init__(self, params):
        default_q: List[T] = []
        default_comparator: Comparator[T] = lambda a, b: (
            0 if a == b else -1 if a < b else 1
        )

        options = params or PriorityQueueParams()

        self.comparator = options.comparator or default_comparator

        if options.from_ is not None:
            self.q = options.from_.copy()
            self.heapify_all()
        else:
            self.q = default_q

    @property
    def length(self) -> int:
        return len(self.q)

    def is_empty(self) -> bool:
        return len(self.q) == 0

    def size(self) -> int:
        return len(self.q)

    def pop(self) -> Optional[T]:
        if len(self.q) == 0:
            return None

        max_val = self.q[0]
        if len(self.q) == 1:
            self.q.pop()
            return max_val

        self.q[0] = self.q[-1]
        self.q.pop()

        self._sift_down(0)
        return max_val

    def peek(self) -> Optional[T]:
        if len(self.q) == 0:
            return None
        return self.q[0]

    def add(self, t: T) -> bool:
        self.q.append(t)
        self._sift_up(len(self.q) - 1)
        return True

    def heapify_all(self):
        n = len(self.q)
        for i in range(n // 2 - 1, -1, -1):
            self._sift_down(i)

    def _sift_down(self, i: int):
        n = len(self.q)
        smallest = i

        while True:
            left = 2 * i + 1
            right = 2 * i + 2

            if left < n and self.comparator(self.q[left], self.q[smallest]) < 0:
                smallest = left

            if right < n and self.comparator(self.q[right], self.q[smallest]) < 0:
                smallest = right

            if smallest == i:
                break

            self.q[i], self.q[smallest] = self.q[smallest], self.q[i]
            i = smallest

    def _sift_up(self, i: int):
        while i > 0:
            parent = (i - 1) // 2

            if self.comparator(self.q[i], self.q[parent]) < 0:
                self.q[i], self.q[parent] = self.q[parent], self.q[i]
                i = parent
            else:
                break

    def get_left_child_index(self, i: int) -> int:
        return i * 2 + 1

    def get_right_child_index(self, i: int) -> int:
        return i * 2 + 2

    def get_parent_index(self, i: int) -> int:
        return (i - 1) // 2

    def is_valid_index(self, i: int) -> bool:
        return 0 <= i < len(self.q)

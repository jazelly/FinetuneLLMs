# Queue abstract class
# implementation details from 
# https://github.com/jazelly/collections-jdk/blob/main/src/PriorityQueue.ts

from typing import Generic, List, Optional, Union, TypeVar, Callable


# Type definitions
T = TypeVar('T')

class QueueNode(Generic[T]):
    def __init__(self, v: T |  None):
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
    
    def pop(self) -> T:
        cur_next = self.head.next
        if cur_next is None:
            return None

        cur_next_next = cur_next.next
        self.head.next = cur_next_next
        if cur_next_next is not None:
            cur_next_next.prev = self.head

        cur_next.prev = None
        cur_next.next = None
        
        self.length -= 1
        return cur_next.value
        
    def __str__(self):
        result = ""
        cur = self.head
        index = 0
        while cur is not None:
            result += f"| Task {index} "
            cur = cur.next
        return result

Comparator = Callable[[T, T], int]
Comparable = Union[int, float, str]

class PriorityQueueParams:
    def __init__(self, from_: Optional[List[T]] = None, comparator: Optional[Comparator[T]] = None):
        self.from_ = from_
        self.comparator = comparator

class PriorityQueue:
    def __init__(self, params):
        default_q: List[T] = []
        default_comparator: Comparator[T] = lambda a, b: 0 if a == b else -1 if a > b else 1

        options = params or PriorityQueueParams()

        if options.from_ is not None:
            self.q = options.from_
            self.heapify_all()
        else:
            self.q = default_q

        self.comparator = options.comparator or default_comparator

    def is_empty(self) -> bool:
        return len(self.q) == 0

    def size(self) -> int:
        return len(self.q)

    def pop(self) -> Optional[T]:
        if len(self.q) == 0:
            return None

        max_val = self.q[0]
        self.q[0] = self.q[-1]
        self.q.pop()

        i = 0
        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            largest = i

            if self.is_valid_index(left) and self.comparator(self.q[left], self.q[largest]) <= 0:
                largest = left

            if self.is_valid_index(right) and self.comparator(self.q[right], self.q[largest]) <= 0:
                largest = right

            if largest != i:
                self.q[i], self.q[largest] = self.q[largest], self.q[i]
                i = largest
            else:
                break

        return max_val

    def peek(self) -> T:
        return self.q[0]

    def add(self, t: T) -> bool:
        self.q.append(t)
        i = len(self.q) - 1

        while i > 0:
            parent = self.get_parent_index(i)

            if self.is_valid_index(parent) and self.comparator(self.q[i], self.q[parent]) <= 0:
                self.q[i], self.q[parent] = self.q[parent], self.q[i]
                i = parent
            else:
                break

        return True

    def heapify_all(self):
        n = len(self.q)
        last_parent = self.get_parent_index(n)
        for i in range(last_parent, -1, -1):
            self.heapify(i)

    def heapify(self, i: int):
        largest = i
        left = self.get_left_child_index(i)
        right = self.get_right_child_index(i)

        if self.is_valid_index(left) and self.q[left] > self.q[largest]:
            largest = left

        if self.is_valid_index(right) and self.q[right] > self.q[largest]:
            largest = right

        if largest != i:
            self.q[i], self.q[largest] = self.q[largest], self.q[i]
            self.heapify(largest)

    def get_left_child_index(self, i: int) -> int:
        return i * 2 + 1

    def get_right_child_index(self, i: int) -> int:
        return i * 2 + 2

    def get_parent_index(self, i: int) -> int:
        return (i - 1) // 2

    def is_valid_index(self, i: int) -> bool:
        return 0 <= i < len(self.q)

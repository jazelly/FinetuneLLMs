import unittest
from django.test import TestCase
from trainer_api.scheduler.queue import MQueue, PriorityQueue, PriorityQueueParams


class MQueueTestCase(TestCase):
    def setUp(self):
        self.queue = MQueue[int]()

    def test_empty_queue(self):
        self.assertEqual(self.queue.length, 0)
        self.assertIsNone(self.queue.pop())

    def test_add_and_peek(self):
        self.queue.add(1)
        self.assertEqual(self.queue.length, 1)
        self.assertEqual(self.queue.peek(), self.queue.head.next)

    def test_add_and_pop(self):
        self.queue.add(1)
        self.queue.add(2)
        self.queue.add(3)
        self.assertEqual(self.queue.length, 3)

        self.assertEqual(self.queue.pop(), 1)
        self.assertEqual(self.queue.length, 2)
        self.assertEqual(self.queue.pop(), 2)
        self.assertEqual(self.queue.length, 1)
        self.assertEqual(self.queue.pop(), 3)
        self.assertEqual(self.queue.length, 0)

        self.assertIsNone(self.queue.pop())

    def test_add_pop_add(self):
        self.queue.add(1)
        self.queue.add(2)
        self.assertEqual(self.queue.pop(), 1)
        self.queue.add(3)
        self.assertEqual(self.queue.pop(), 2)
        self.assertEqual(self.queue.pop(), 3)
        self.assertIsNone(self.queue.pop())

    def test_string_representation(self):
        self.queue.add(1)
        self.queue.add(2)
        str_repr = str(self.queue)
        self.assertIn("Task: 0", str_repr)
        self.assertIn("->", str_repr)


class PriorityQueueTestCase(TestCase):
    def setUp(self):
        self.queue = PriorityQueue(None)

    def test_empty_queue(self):
        self.assertTrue(self.queue.is_empty())
        self.assertEqual(self.queue.size(), 0)
        self.assertIsNone(self.queue.pop())

    def test_add_and_pop_default_comparator(self):
        self.queue.add(3)
        self.queue.add(1)
        self.queue.add(2)

        self.assertEqual(self.queue.size(), 3)
        self.assertEqual(self.queue.peek(), 1)

        self.assertEqual(self.queue.pop(), 1)
        self.assertEqual(self.queue.pop(), 2)
        self.assertEqual(self.queue.pop(), 3)
        self.assertIsNone(self.queue.pop())

    def test_custom_comparator(self):
        # test max heap behaviour
        max_heap_comparator = lambda a, b: 0 if a == b else -1 if a > b else 1
        params = PriorityQueueParams(comparator=max_heap_comparator)
        max_queue = PriorityQueue(params)

        max_queue.add(3)
        max_queue.add(1)
        max_queue.add(2)

        self.assertEqual(max_queue.peek(), 3)
        self.assertEqual(max_queue.pop(), 3)
        self.assertEqual(max_queue.pop(), 2)
        self.assertEqual(max_queue.pop(), 1)

    def test_initialize_from_list(self):
        init_list = [3, 1, 4, 1, 5, 9]
        params = PriorityQueueParams(from_=init_list)
        queue = PriorityQueue(params)

        self.assertEqual(queue.size(), 6)

        self.assertEqual(queue.pop(), 1)
        self.assertEqual(queue.pop(), 1)
        self.assertEqual(queue.pop(), 3)
        self.assertEqual(queue.pop(), 4)
        self.assertEqual(queue.pop(), 5)
        self.assertEqual(queue.pop(), 9)

    def test_heapify(self):
        queue = PriorityQueue(None)
        queue.q = [5, 3, 1, 4, 2]

        queue.heapify_all()
        self.assertEqual(queue.pop(), 1)
        self.assertEqual(queue.pop(), 2)
        self.assertEqual(queue.pop(), 3)
        self.assertEqual(queue.pop(), 4)
        self.assertEqual(queue.pop(), 5)


if __name__ == "__main__":
    unittest.main()

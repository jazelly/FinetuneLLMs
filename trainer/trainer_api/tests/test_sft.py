from trainer_api.utils.misc import get_current_device


from django.test import TestCase


class SFTTestCase(TestCase):
    def setUp(self):
        # Create test data
        pass

    def test_get_current_device(self):
        """
        Must get current device
        """
        print(get_current_device())

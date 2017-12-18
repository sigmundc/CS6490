# import pyttsx
# engine = pyttsx.init()
# engine.say('This is a test!')
# engine.runAndWait()

from gtts import gTTS
import os

challenges = [
    'Please select all images without cars.',
    'Please select middle-left, middle-center, and bottom-right images.',
    'Please select all images with trees.',
    'Please select the top-center image.'
]

for i in range(4):
    tts = gTTS(text=challenges[i], lang='en')
    tts.save("c{}.mp3".format(i+1))
# os.system("mpg321 good.mp3")

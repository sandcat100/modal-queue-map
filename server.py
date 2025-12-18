import modal
import time
import os
from datetime import datetime

app = modal.App("modal-queue-map")
convex_image = modal.Image.debian_slim().pip_install("convex")

GPU_TYPES = ["b200", "h200", "h100", "a100-80gb", "a100", "l40s", "a10g", "l4", "t4"]

@app.function(image=convex_image)  
def send_times(sample):
    from convex import ConvexClient

    client = ConvexClient("https://groovy-buffalo-393.convex.cloud")
    client.mutation("queue_times:put", sample)

@app.cls(container_idle_timeout = 2, secrets=[modal.Secret.from_name("convex-secret")])
class QueueTimeWatch:

    @modal.method()
    def measure_time(self, start_time, start_datetime, gpu_type):
        end_time = time.time()
        queue_time = end_time - start_time
        rounded_time = round_time(start_datetime)
        sample = {
            "time": rounded_time.timestamp(),
            "resource_type": gpu_type.upper(),
            "value": queue_time,
        }
        print(sample)
        sample["apiKey"] = os.environ["CONVEX_TOKEN"]
        send_times.remote(sample)

def round_time(dt):
    minute = dt.minute
    if minute < 30:
        new_minute = 0
    else:
        new_minute = 30
    return dt.replace(minute=new_minute, second=0, microsecond=0)

@app.function(
    schedule=modal.Cron("0,30 * * * *")
)
def get_queue_times():
    function_calls = []
    for gpu_type in GPU_TYPES:
        timer = QueueTimeWatch.with_options(gpu=gpu_type)
        function_call = timer().measure_time.spawn(time.time(), datetime.now(), gpu_type)
        function_calls.append(function_call)
    
    modal.functions.gather(*function_calls)

@app.local_entrypoint()
def main():
    get_queue_times.remote()
# SAMPLE INPUT/OUTPUT #1
# INPUT


ADD_DRIVER D1 1 1
ADD_DRIVER D2 4 5
ADD_DRIVER D3 2 2
ADD_RIDER R1 0 0
MATCH R1
START_RIDE RIDE-001 2 R1
STOP_RIDE RIDE-001 4 5 32
BILL RIDE-001


# OUTPUT
DRIVERS_MATCHED D1 D3
RIDE_STARTED RIDE-001
RIDE_STOPPED RIDE-001
BILL RIDE-001 D3 186.72

```python
import math
class raider():
    def __init__():
                firstname= input()
    def ADD_DRIVER(self, Driver_id , x_coordinates , y_coordinates):
        self.Driver_list={}
        if Driver_id in driver_list:
            Driver_id=[x_coordinates, y_coordinates]
        else:
            driver_list[Driver_id]=[x_coordinates,y_coordinates]
            
    def ADD_RIDER(self,Rider_id , x_coordinates, y_coordinates):
        self.Rider_list={}
        if Rider_id in Rider_list:
            Rider_id=[x_coordinates, y_coordinates]
        else:
            Rider_list[Rider_id]=[x_coordinates,y_coordinates]
    def Match(Rider_id):
        Rider_coordinates=[]
        for i in self.Rider_list:
            if Rider_id == i:
                Rider_coordinates=self.Rider_list[i]
        Distances_dic={}
        # calculating distances
        for i in self.Driver_id:
            Driver_coordinates=self.Driver[Driver_id]
            Distances_dic[Driver_id]=math.sqrt((Rider_coordinates[0]-Driver_coordinates[0]), (Rider_coordinates[1]-Driver_coordinates[1]))
        Distances_dic=dict(sorted(Distances.items(),key=lambda x:(-x[1],x[0])))
        print(f"nearest driver {Distaces_dic[0]}'")
        return 
    def DRIVERS_MATCHED():
    def STOP_RIDE():
    def BILL (RIDE_ID):
```

```python
import math

def calculate_distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

class Driver:
    def __init__(self, id, x, y, available=True):
        self.id = id
        self.x = x
        self.y = y
        self.available = available

class Rider:
    def __init__(self, id, x, y):
        self.id = id
        self.x = x
        self.y = y

class Ride:
    def __init__(self, id, rider, driver):
        self.id = id
        self.rider = rider
        self.driver = driver
        self.start_x = rider.x
        self.start_y = rider.y
        self.end_x = None
        self.end_y = None
        self.duration = None
        self.is_ongoing = True

    def stop_ride(self, end_x, end_y, duration):
        self.end_x = end_x
        self.end_y = end_y
        self.duration = duration
        self.is_ongoing = False

    def calculate_bill(self):
        if self.is_ongoing:
            raise ValueError("Ride is still ongoing")
        
        distance = calculate_distance(self.start_x, self.start_y, self.end_x, self.end_y)
        base_fare = 50
        distance_fare = 6.5 * distance
        time_fare = 2 * self.duration
        subtotal = base_fare + distance_fare + time_fare
        total = subtotal * 1.2  # 20% service tax
        return round(total, 2)

class RideHailingSystem:
    def __init__(self):
        self.drivers = {}
        self.riders = {}
        self.rides = {}

    def add_driver(self, driver_id, x, y):
        self.drivers[driver_id] = Driver(driver_id, x, y)

    def add_rider(self, rider_id, x, y):
        self.riders[rider_id] = Rider(rider_id, x, y)

    def match(self, rider_id):
        rider = self.riders.get(rider_id)
        if not rider:
            return []

        available_drivers = [
            (driver_id, driver) for driver_id, driver in self.drivers.items()
            if driver.available
        ]

        matched_drivers = sorted(
            [
                (driver_id, calculate_distance(rider.x, rider.y, driver.x, driver.y))
                for driver_id, driver in available_drivers
                if calculate_distance(rider.x, rider.y, driver.x, driver.y) <= 5
            ],
            key=lambda x: (x[1], x[0])
        )

        return [driver_id for driver_id, _ in matched_drivers[:5]]

    def start_ride(self, ride_id, n, rider_id):
        if ride_id in self.rides:
            return "INVALID_RIDE"

        matched_drivers = self.match(rider_id)
        if n > len(matched_drivers):
            return "INVALID_RIDE"

        driver_id = matched_drivers[n - 1]
        driver = self.drivers[driver_id]
        rider = self.riders[rider_id]

        if not driver.available:
            return "INVALID_RIDE"

        driver.available = False
        self.rides[ride_id] = Ride(ride_id, rider, driver)
        return f"RIDE_STARTED {ride_id}"

    def stop_ride(self, ride_id, end_x, end_y, duration):
        ride = self.rides.get(ride_id)
        if not ride or not ride.is_ongoing:
            return "INVALID_RIDE"

        ride.stop_ride(end_x, end_y, duration)
        ride.driver.available = True
        return f"RIDE_STOPPED {ride_id}"

    def bill(self, ride_id):
        ride = self.rides.get(ride_id)
        if not ride or ride.is_ongoing:
            return "INVALID_RIDE"

        amount = ride.calculate_bill()
        return f"BILL {ride_id} {ride.driver.id} {amount}"

def process_command(system, command):
    parts = command.split()
    action = parts[0]

    if action == "ADD_DRIVER":
        system.add_driver(parts[1], float(parts[2]), float(parts[3]))
        return ""
    elif action == "ADD_RIDER":
        system.add_rider(parts[1], float(parts[2]), float(parts[3]))
        return ""
    elif action == "MATCH":
        matched_drivers = system.match(parts[1])
        if not matched_drivers:
            return "NO_DRIVERS_AVAILABLE"
        return f"DRIVERS_MATCHED {' '.join(matched_drivers)}"
    elif action == "START_RIDE":
        return system.start_ride(parts[1], int(parts[2]), parts[3])
    elif action == "STOP_RIDE":
        return system.stop_ride(parts[1], float(parts[2]), float(parts[3]), int(parts[4]))
    elif action == "BILL":
        return system.bill(parts[1])
    else:
        return "INVALID_COMMAND"

def main():
    system = RideHailingSystem()
    print("Enter your commands (end input with an empty line):")
    
    input_data = []
    while True:
        try:
            line = input().strip()
            if not line:
                break
            input_data.append(line)
        except EOFError:
            break
    
    for command in input_data:
        command = command.strip()
        if command:
            result = process_command(system, command)
            if result:
                print(result)

if __name__ == "__main__":
    main()
```

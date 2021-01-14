function SeatReservation(name, initialMeal) {
    var self = this;
    self.name = name;
    self.meal = ko.observable(initialMeal);
    self.formattedPrice = ko.computed(function () {
        var price = self.meal().price;
        return price ? "$" + price.toFixed(2) : "None";
    });
}

function ReservationsViewModel() {
    var self = this;
    self.reservations = [];

    // Non-editable catalog data - would come from the server
    self.availableMeals = [{
        mealName: "Standard (sandwich)",
        price: 0
    },
    {
        mealName: "Premium (lobster)",
        price: 34.95
    },
    {
        mealName: "Ultimate (whole zebra)",
        price: 290
    }
    ];

    self.seatsToFill = ko.observable(5);
    self.seats = ko.observableArray();

    self.addSeat = function () {
        self.seats.push(new SeatReservation(self.seats().length + 1, self.availableMeals[Math.round(Math.random(2) * 2)]));
    }

    self.removeSeat = function (seat) {
        self.seats.remove(seat);
    }

    self.removeWhile = function () {
        let val = self.seats().length - self.seatsToFill();
        while (val > 0) {
            console.log('removing:', self.seats.pop());
            v--;
        }
    }

    self.removeSlice = function () {
        let removals = self.seats().length - self.seatsToFill();
        // need to reassign because 'slice' doesn't change the original array
        self.seats(self.seats().slice(0, Math.abs(self.seats().length - removals)));
    }

    self.hasAvailableSeats = ko.computed(function () {
        var result = self.seats().length < self.seatsToFill();
        if (!result) {
            self.removeSlice();
        }
        return result;
    });

    self.totalSurcharges = ko.computed(function () {
        let total = 0;
        self.seats().forEach(function (i, idx) {
            return total += i.meal().price;
        });
        return total;
    });
}

ko.applyBindings(new ReservationsViewModel());
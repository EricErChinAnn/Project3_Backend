let allOrder =
    [
        {
            "id": 11,
            "postal_code": "541227",
            "address_line_1": "227a Compassvale Link",
            "address_line_2": "#05-210",
            "country": "SG",
            "order_date": "2023-01-03T00:00:00.000Z",
            "shipping_cost": 500,
            "receipt_url": "https://invoice.stripe.com/i/acct_1MGeyfDiFXUY0kBq/test_YWNjdF8xTUdleWZEaUZYVVkwa0JxLF9ONkhpaWVSRFFjMXg1UHhZbE9pWjlPTWFaczZhZ0Q3LDYzMjg0Njc40200wAC1dbTN?s=ap",
            "payment_type": "card",
            "status_id": 2,
            "statuses": {
                "id": 2,
                "status": "Shipping"
            },
            "customers": [
                {
                    "id": 2,
                    "username": "Customer A",
                    "email": "cus1@gemail.com",
                    "password": "VNXLLTMtvbSFApPKrkVZzoi2UWPx6l1OSzrEnXct7RQ=",
                    "dob": "1111-11-11T00:00:00.000Z",
                    "contact": 96716969,
                    "postal_code": "527117",
                    "address_line_1": "Compassvale Drive 117A",
                    "address_line_2": "#07-210",
                    "country": "Singapore",
                    "_pivot_order_id": 11,
                    "_pivot_customer_id": 2
                }
            ]
        },
        {
            "id": 12,
            "postal_code": "541293",
            "address_line_1": "293A Compassvale Crescent, Singapore 541293",
            "address_line_2": "#05-210",
            "country": "SG",
            "order_date": "2023-01-04T00:00:00.000Z",
            "shipping_cost": 500,
            "receipt_url": "https://invoice.stripe.com/i/acct_1MGeyfDiFXUY0kBq/test_YWNjdF8xTUdleWZEaUZYVVkwa0JxLF9ONmZTZnlUbXdrOG1BMXVjaDdVdTdCa1U3WWU0UGxULDYzMzYwODY20200fggG17w3?s=ap",
            "payment_type": "card",
            "status_id": 1,
            "statuses": {
                "id": 1,
                "status": "Paid"
            },
            "customers": [
                {
                    "id": 2,
                    "username": "Customer A",
                    "email": "cus1@gemail.com",
                    "password": "VNXLLTMtvbSFApPKrkVZzoi2UWPx6l1OSzrEnXct7RQ=",
                    "dob": "1111-11-11T00:00:00.000Z",
                    "contact": 96716969,
                    "postal_code": "527117",
                    "address_line_1": "Compassvale Drive 117A",
                    "address_line_2": "#07-210",
                    "country": "Singapore",
                    "_pivot_order_id": 12,
                    "_pivot_customer_id": 2
                }
            ]
        },
        {
            "id": 13,
            "postal_code": "541293",
            "address_line_1": "293A Compassvale Crescent, Singapore 541293",
            "address_line_2": "#05-210",
            "country": "SG",
            "order_date": "2023-01-04T00:00:00.000Z",
            "shipping_cost": 1000,
            "receipt_url": "https://invoice.stripe.com/i/acct_1MGeyfDiFXUY0kBq/test_YWNjdF8xTUdleWZEaUZYVVkwa0JxLF9ONmV6U3RMa0JWU1l5Qnk3WVFaZ2VtSU1xcHo2cHkzLDYzMzYyODAx0200XI7si7js?s=ap",
            "payment_type": "card",
            "status_id": 1,
            "statuses": {
                "id": 1,
                "status": "Paid"
            },
            "customers": [
                {
                    "id": 2,
                    "username": "Customer A",
                    "email": "cus1@gemail.com",
                    "password": "VNXLLTMtvbSFApPKrkVZzoi2UWPx6l1OSzrEnXct7RQ=",
                    "dob": "1111-11-11T00:00:00.000Z",
                    "contact": 96716969,
                    "postal_code": "527117",
                    "address_line_1": "Compassvale Drive 117A",
                    "address_line_2": "#07-210",
                    "country": "Singapore",
                    "_pivot_order_id": 13,
                    "_pivot_customer_id": 2
                }
            ]
        }
    ]

let customerId = 2

let orders = []

for (let each of allOrder) {
    for (let e of each.customers) {
        if (e.id === customerId ){
            orders.push(each)
        }
    }
}

console.log(orders)
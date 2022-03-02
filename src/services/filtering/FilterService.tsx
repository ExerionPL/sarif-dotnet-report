import { Subject, Subscription } from "rxjs";

export interface ISarifFilters
{
    driver: string[];
    level: string[];
    category: string[];
    file: string[];
    rule: string[];
}

class FiltersService
{
    private events: Subject<ISarifFilters>;

    constructor()
    {
        this.events = new Subject<ISarifFilters>();
    }

    public subscribe(next: (args: ISarifFilters) => void): Subscription
    {
        return this.events.subscribe({ next });
    }

    public dispatch(args: ISarifFilters): void
    {
        this.events.next(args);
    }
}

const filterService = new FiltersService();

export default filterService;
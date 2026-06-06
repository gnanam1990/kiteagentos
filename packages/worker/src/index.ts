import { buildActivity, type ActivityEvent, type ProductItem } from "@kiteagentos/core";

export interface QueueItem {
  item: ProductItem;
  message: string;
}

export class PreviewRuntime {
  private queue: QueueItem[] = [];
  private history: ActivityEvent[] = [];

  enqueue(item: QueueItem) {
    this.queue.push(item);
    return this.queue.length;
  }

  tick(now = new Date()) {
    const item = this.queue.shift();
    if (!item) return null;
    const event = buildActivity(item.item, item.message, now);
    this.history.unshift(event);
    return event;
  }

  getHistory() {
    return [...this.history];
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("KiteAgentOS worker ready. Import PreviewRuntime to enqueue preview jobs.");
}
